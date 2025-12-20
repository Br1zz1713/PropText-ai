import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { description, propertyType, location, sqMeters, bedrooms, bathrooms, amenities, style, language } = body;

        // Auto-generate a title
        const title = `${propertyType} in ${location}`;

        const { data, error } = await supabase.from("listings").insert({
            user_id: user.id,
            title,
            type: propertyType,
            description,
            location,
            property_details: {
                sqMeters,
                bedrooms,
                bathrooms,
                amenities,
                style,
                language
            }
        }).select();

        if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(error.message);
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
