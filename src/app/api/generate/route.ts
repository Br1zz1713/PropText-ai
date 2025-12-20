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
    const hasCredits = profile.credits_remaining > 0;

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
                .update({ credits_remaining: profile.credits_remaining - 1 })
                .eq("id", user.id);

            if (updateError) throw new Error("Failed to update credits");
        }

        // 5. Save Generation & Listing (Auto-Save)
        const title = `${propertyType} in ${location}`;

        await Promise.all([
            supabase.from("generations").insert({
                user_id: user.id,
                input_data: { propertyType, sqMeters, bedrooms, bathrooms, location, amenities, usp },
                output_text: description,
                language,
                style,
            }),
            supabase.from("listings").insert({
                user_id: user.id,
                title,
                type: propertyType,
                description,
                location,
                property_details: { sqMeters, bedrooms, bathrooms, amenities, style, language }
            })
        ]);

        return NextResponse.json({ description });

    } catch (error: any) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate description" },
            { status: 500 }
        );
    }
}
