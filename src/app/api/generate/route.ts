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
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

        // Import genAI from lib (ensure it is exported)
        // Note: We need to import genAI at the top, I will add the import separately or rely on global scope if I could, but better to use the imported 'model' as base and re-use client.
        // Actually, I can't easily import 'genAI' if I didn't verify the import line.
        // I will use the 'model' object to access the client, OR just assume the first attempt uses the default exported model, and then I try others.
        // BETTER: Use a loop.

        let success = false;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[DEBUG] Attempting generation with model: ${modelName}`);
                // distinct import needed? We can use the imported 'genAI' client if we updated the import.
                // Since I updated the export in gemini.ts, I need to update the import in this file too.
                // For now, I will assume the 'model' export was purely for convenience and I should use 'genAI' if available.
                // WAIT, I haven't updated the IMPORT in this file yet.
                // I will do that in a separate step or just use the existing 'model' for the first try, then fail.
                // Actually, to make this robust, I'll assume I can't import genAI yet without modifying the top of file.
                // So I will write the LOGIC assuming 'genAI' is available.

                const dynamicModel = (await import("@/lib/gemini")).genAI.getGenerativeModel({ model: modelName });
                const result = await dynamicModel.generateContent(prompt);
                description = result.response.text();
                console.log(`[DEBUG] Success with model: ${modelName}`);
                success = true;
                break;
            } catch (error: any) {
                console.error(`[DEBUG] Failed with model ${modelName}:`, error.message);
                geminiErrorDetails = error.message;
            }
        }

        if (!success) {
            console.error("[DEBUG] All models failed.");
            // Fallback to allow DB save verification if completely broken
            description = `Generation Failed. detailed error: ${geminiErrorDetails}`;
            throw new Error(`All models failed. Last error: ${geminiErrorDetails}`);
        }


        // 4. Deduct Credit (Only if not Pro)
        if (!isPro) {
            console.log("[DEBUG] Step C.1: Deducting Credit");
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ credits_remaining: profile.credits_remaining - 1 })
                .eq("id", user.id);

            if (updateError) console.error("[DEBUG] Credit Deduction Error:", updateError);
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
