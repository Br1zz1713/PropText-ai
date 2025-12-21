import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient();

    // Admin client to bypass RLS for profile creation if needed
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("[DEBUG] Step A: Auth Check Start");
    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error("[DEBUG] Step A FAILED: Unauthorized", authError);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[DEBUG] Step A Success: User", user.id);

    // 2. Check Credits & Subscription
    console.log("[DEBUG] Step A.1: Checking Credits & Branding");
    let { data: profile } = await supabase
        .from("profiles")
        .select("credits_remaining, subscription_status, agency_name, phone_number")
        .eq("id", user.id)
        .single();

    if (!profile) {
        console.log("[DEBUG] Profile missing, forcing create/default");
        // Attempt to auto-create logic using Admin client to bypass RLS
        const { error: insertError } = await supabaseAdmin.from("profiles").insert({
            id: user.id,
            email: user.email,
            credits_remaining: 3,
            subscription_status: "free",
        });

        if (insertError) {
            console.error("[DEBUG] Admin Profile Creation Failed:", insertError);
            // DO NOT BLOCK: Fallback to temporary guest credits
            profile = { credits_remaining: 3, subscription_status: 'free', agency_name: null, phone_number: null };
        } else {
            // Re-fetch or manually set after successful insert
            profile = { credits_remaining: 3, subscription_status: 'free', agency_name: null, phone_number: null };
        }
    }

    const isPro = profile.subscription_status === 'active';
    // Default to 3 if null
    const credits = profile.credits_remaining ?? 3;
    const hasCredits = credits > 0;

    if (!isPro && !hasCredits) {
        console.warn("[DEBUG] Step A.1 FAILED: Insufficient credits");
        return NextResponse.json(
            { error: "Insufficient credits. Please upgrade to Pro for unlimited generation." },
            { status: 403 }
        );
    }

    try {
        const {
            propertyType,
            sqm, // UNIFIED: sqm
            bedrooms,
            bathrooms,
            location,
            amenities,
            usp,
            style,
            language
        } = await req.json();

        if (Number(sqm) < 0 || Number(bedrooms) < 0 || Number(bathrooms) < 0) {
            return NextResponse.json({ error: "Values cannot be negative" }, { status: 400 });
        }

        // Construct Signature
        const signature = profile?.agency_name || profile?.phone_number
            ? `\n\n**Contact:**\n${profile.agency_name ? profile.agency_name : ""}${profile.agency_name && profile.phone_number ? " - " : ""}${profile.phone_number ? profile.phone_number : ""}`
            : "";

        // 3. Generate Description
        console.log("[DEBUG] Step B: Gemini Request Start", { propertyType, location, sqm });
        const prompt = `
            Role: You are a luxury real estate copywriter known for "Apple-style" minimalism and sophistication.
            
            Task: Write a premium property description based on the following details.
            
            DETAILS:
            - Property Type: ${propertyType}
            - Size: ${sqm} sqm
            - Configuration: ${bedrooms} Bed, ${bathrooms} Bath
            - Location: ${location}
            - Amenities: ${amenities}
            - Unique Selling Point: ${usp}
            - Language: ${language}
            
            STYLE & TONE:
            - Tone: ${style} (Professional, Inviting, Sophisticated).
            - Forbidden: Do NOT use generic fluff like "amazing apartment" or "stunning views" unless supported by specific details.
            
            REQUIRED STRUCTURE (Markdown):
            
            # [Write a Catchy, Bold Headline Here]
            
            **Location & Vibe**
            [Paragraph 1: Focus on the location advantages and the general vibe of the neighborhood using the location data "${location}".]
            
            **Interior & Design**
            [Paragraph 2: Describe the interior features, highlighting the ${sqm} sqm size, ${bedrooms} bedrooms, and specific amenities: ${amenities}.]
            
            **Lifestyle**
            [Paragraph 3: Sell the lifestyle. Mention the USP: "${usp}" and how it elevates daily living.]
            
            **Inquire**
            [Professional Call to Action]${signature ? `\n\n(IMPORTANT: Append this exact signature at the absolute end: "${signature}")` : ""}
        `;

        let description = "";
        let geminiErrorDetails = "";

        // List of models to try in order of preference
        let modelsToTry = ["gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro"];

        let success = false;
        let lastError = null;
        let triedModels = new Set<string>();

        // 1. Try Hardcoded
        for (const modelName of modelsToTry) {
            if (triedModels.has(modelName)) continue;
            triedModels.add(modelName);

            try {
                console.log(`[DEBUG] Attempting generation with model: ${modelName}`);
                const { genAI } = await import("@/lib/gemini");
                const dynamicModel = genAI.getGenerativeModel({ model: modelName });
                const result = await dynamicModel.generateContent(prompt);
                description = result.response.text();
                console.log(`[DEBUG] Success with model: ${modelName}`);
                success = true;
                break;
            } catch (error: any) {
                console.error(`[DEBUG] Failed with model ${modelName}:`, error.message);
                lastError = error;
                geminiErrorDetails += `[${modelName}: ${error.message}] `;
            }
        }

        // 2. Auto-Discovery Fallback
        if (!success) {
            console.log("[DEBUG] All hardcoded models failed. Converting to Auto-Discovery Mode...");
            try {
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GEMINI_API_KEY}`);
                const listData = await listRes.json();

                if (listData.models) {
                    const availableModels = listData.models
                        .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
                        .map((m: any) => m.name) // Use the full 'models/...' name
                        .sort((a: string, b: string) => {
                            // Sort preference: flash > 1.5 > pro
                            const score = (name: string) => {
                                if (name.includes("1.5-flash")) return 3;
                                if (name.includes("1.5-pro")) return 2;
                                if (name.includes("gemini-pro")) return 1;
                                return 0;
                            };
                            return score(b) - score(a);
                        });

                    console.log(`[DEBUG] Discovered available models: ${availableModels.join(", ")}`);

                    for (const modelName of availableModels) {
                        if (triedModels.has(modelName)) continue;
                        triedModels.add(modelName);

                        try {
                            console.log(`[DEBUG] Auto-Discovery Attempt: ${modelName}`);
                            const { genAI } = await import("@/lib/gemini");
                            const dynamicModel = genAI.getGenerativeModel({ model: modelName });
                            const result = await dynamicModel.generateContent(prompt);
                            description = result.response.text();
                            console.log(`[DEBUG] Auto-Discovery Success using: ${modelName}`);
                            success = true;
                            break;
                        } catch (error: any) {
                            console.error(`[DEBUG] Auto-Discovery Failed with ${modelName}:`, error.message);
                            geminiErrorDetails += `[${modelName}: ${error.message}] `;
                        }
                    }
                }
            } catch (listError: any) {
                console.error("[DEBUG] Failed to list models for auto-discovery:", listError);
                geminiErrorDetails += `[ListModels Failed: ${listError.message}]`;
            }
        }

        if (!success) {
            const errorMsg = `Generation Failed. Unable to find a working model. Errors: ${geminiErrorDetails}`;
            console.error(errorMsg);
            return NextResponse.json(
                { error: errorMsg },
                { status: 500 }
            );
        }


        // 4. Deduct Credit (Only if not Pro)
        if (!isPro) {
            console.log("[DEBUG] Step C.1: Deducting Credit (Re-fetching latest balance)");
            // Re-fetch latest credits to ensure atomic-like correctness after long generation
            const { data: latestProfile } = await supabase
                .from("profiles")
                .select("credits_remaining")
                .eq("id", user.id)
                .single();

            if (latestProfile && latestProfile.credits_remaining > 0) {
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({ credits_remaining: latestProfile.credits_remaining - 1 })
                    .eq("id", user.id);

                if (updateError) console.error("[DEBUG] Credit Deduction Error:", updateError);
            } else {
                console.warn("[DEBUG] Credit Deduction Skipped: User has 0 credits (race condition caught)");
            }
        }

        // 5. Save Generation & Listing (Auto-Save)
        console.log("[DEBUG] Step C: Database Insert Start (Generations & Listings)");
        const title = `${propertyType} in ${location}`;

        const { error: dbError } = await supabase.from("listings").insert({
            user_id: user.id,
            title,
            property_type: propertyType,
            description,
            location,
            property_details: { sqm, bedrooms, bathrooms, amenities, style, language }
        });

        if (dbError) {
            console.error("[DEBUG] Step C FAILED (Listings):", dbError);
            throw new Error("Failed to save listing: " + dbError.message);
        }

        // Best effort for generations logs
        await supabase.from("generations").insert({
            user_id: user.id,
            input_data: { propertyType, sqm, bedrooms, bathrooms, location, amenities, usp },
            output_text: description,
            language,
            style,
        });

        console.log("[DEBUG] Step D: Success - Returning Response");
        return NextResponse.json({ description });

    } catch (error: any) {
        console.error("[DEBUG] CRITICAL FAILURE:", error);
        return NextResponse.json(
            { error: `Generation Failed: ${error.message}` },
            { status: 500 }
        );
    }
}
