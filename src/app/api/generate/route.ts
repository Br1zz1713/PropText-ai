import { createClient } from "@/utils/supabase/server";
import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient();

    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check Credits & Subscription
    const { data: profile } = await supabase
        .from("profiles")
        .select("credits_left, subscription_status")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return NextResponse.json(
            { error: "User profile not found." },
            { status: 404 }
        );
    }

    const isPro = profile.subscription_status === 'active';
    const hasCredits = profile.credits_left > 0;

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

        // 3. Generate Description
        const prompt = `
      Act as a professional real estate copywriter. Write a compelling property description for a listing in Europe.
      
      Details:
      - Property Type: ${propertyType}
      - Size: ${sqMeters} sqm
      - Configuration: ${bedrooms} Bed, ${bathrooms} Bath
      - Location: ${location}
      - Amenities: ${amenities}
      - Unique Selling Point: ${usp}
      
      Style: ${style}
      Language: ${language}
      
      Output only the description text. Do not include introductory phrases.
    `;

        const result = await model.generateContent(prompt);
        const description = result.response.text();

        // 4. Deduct Credit (Only if not Pro)
        if (!isPro) {
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ credits_left: profile.credits_left - 1 })
                .eq("id", user.id);

            if (updateError) throw new Error("Failed to update credits");
        }

        // 5. Save Generation
        await supabase.from("generations").insert({
            user_id: user.id,
            input_data: { propertyType, sqMeters, bedrooms, bathrooms, location, amenities, usp },
            output_text: description,
            language,
            style,
        });

        return NextResponse.json({ description });

    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate description" },
            { status: 500 }
        );
    }
}
