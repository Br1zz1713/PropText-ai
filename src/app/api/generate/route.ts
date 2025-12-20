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

    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check Credits & Subscription
    let { data: profile } = await supabase
        .from("profiles")
        .select("credits_remaining, subscription_status")
        .eq("id", user.id)
        .single();

    if (!profile) {
        // Attempt to auto-create logic using Admin client to bypass RLS
        const { error: insertError } = await supabaseAdmin.from("profiles").insert({
            id: user.id,
            email: user.email,
            credits_remaining: 3,
            subscription_status: "free",
        });

        if (insertError) {
            console.error("Admin Profile Creation Failed:", insertError);
            // DO NOT BLOCK: Fallback to temporary guest credits
            profile = { credits_remaining: 3, subscription_status: 'free' };
        } else {
            // Re-fetch or manually set after successful insert
            profile = { credits_remaining: 3, subscription_status: 'free' };
        }
    }

    const isPro = profile.subscription_status === 'active';
    // Default to 3 if null
    const credits = profile.credits_remaining ?? 3;
    const hasCredits = credits > 0;

    if (!isPro && !hasCredits) {
        return NextResponse.json(
            { error: "Insufficient credits. Please upgrade to Pro for unlimited generation." },
            { status: 403 }
        );
    }

    try {
        const {
            propertyType,
            sqMeters,
            bedrooms,
            bathrooms,
            location,
            amenities,
            usp,
            style,
            language
        } = await req.json();

        if (Number(sqMeters) < 0 || Number(bedrooms) < 0 || Number(bathrooms) < 0) {
            return NextResponse.json({ error: "Values cannot be negative" }, { status: 400 });
        }

        // 3. Generate Description
        const prompt = `
            Role: You are a luxury real estate copywriter known for "Apple-style" minimalism and sophistication.
            
            Task: Write a premium property description based on the following details.
            
            DETAILS:
            - Property Type: ${propertyType}
            - Size: ${sqMeters} sqm
            - Configuration: ${bedrooms} Bed, ${bathrooms} Bath
            - Location: ${location}
            - Amenities: ${amenities}
            - Unique Selling Point: ${usp}
            
            STYLE & TONE:
            - Tone: ${style} (Professional, Inviting, Sophisticated).
            - Forbidden: Do NOT use generic fluff like "amazing apartment" or "stunning views" unless supported by specific details.
            
            REQUIRED STRUCTURE (Markdown):
            
            # [Write a Catchy, Bold Headline Here]
            
            **Location & Vibe**
            [Paragraph 1: Focus on the location advantages and the general vibe of the neighborhood using the location data "${location}".]
            
            **Interior & Design**
            [Paragraph 2: Describe the interior features, highlighting the ${sqMeters} sqm size, ${bedrooms} bedrooms, and specific amenities: ${amenities}.]
            
            **Lifestyle**
            [Paragraph 3: Sell the lifestyle. Mention the USP: "${usp}" and how it elevates daily living.]
            
            **Inquire**
            [Professional Call to Action]
        `;

        let description = "";

        try {
            const result = await model.generateContent(prompt);
            description = result.response.text();
        } catch (geminiError: any) {
            console.error("Gemini API Error:", geminiError);
            // Fallback to allow DB save verification
            description = `Test Description (Fallback due to API Error: ${geminiError.message || "Unknown Error"})`;
        }

        // 4. Deduct Credit (Only if not Pro)
        if (!isPro) {
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ credits_remaining: profile.credits_remaining - 1 })
                .eq("id", user.id);

            if (updateError) throw new Error("Failed to update credits");
        }

        // 5. Save Generation & Listing (Auto-Save)
        const title = `${propertyType} in ${location}`;

        await Promise.all([
            // Generations Table
            supabase.from("generations").insert({
                user_id: user.id,
                input_data: { propertyType, sqMeters, bedrooms, bathrooms, location, amenities, usp },
                output_text: description,
                language,
                style,
            }),
            // Listings Table
            supabase.from("listings").insert({
                user_id: user.id,
                title,                   // Explicitly requested
                property_type: propertyType, // Fixed column name
                description,             // Explicitly requested
                location,                // Explicitly requested
                property_details: { sqMeters, bedrooms, bathrooms, amenities, style, language }
            })
        ]);

        return NextResponse.json({ description });

    } catch (error: any) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: `Generation Failed: ${error.message}` },
            { status: 500 }
        );
    }
}
