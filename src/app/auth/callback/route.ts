import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("id", user.id)
                    .single();

                if (!profile) {
                    const { error: insertError } = await supabase.from("profiles").insert({
                        id: user.id,
                        email: user.email,
                        credits_remaining: 3,
                    });

                    if (insertError) {
                        console.error("Profile Creation Error:", insertError);
                        return NextResponse.redirect(`${getSiteUrl()}/login?error=Failed to create user profile`);
                    }
                }
            }
            return NextResponse.redirect(`${getSiteUrl()}${next}?welcome=true`);
        } else {
            console.error("Auth Callback Error:", error);
            return NextResponse.redirect(`${getSiteUrl()}/login?error=${error.message}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${getSiteUrl()}/login?error=Could not authenticate user`);
}
