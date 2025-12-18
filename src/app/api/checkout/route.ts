import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email!,
                metadata: {
                    supabaseUserId: user.id
                }
            });
            customerId = customer.id;
            await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID, // Ensure this is set in env
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
            metadata: {
                supabaseUserId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
