import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js"; // Use admin client for webhooks
import { NextResponse } from "next/server";

// Admin client to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        // Subscription created
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const userId = session.metadata.supabaseUserId;

        await supabaseAdmin
            .from("profiles")
            .update({
                stripe_customer_id: session.customer,
                subscription_status: "active",
            })
            .eq("id", userId);
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as any;
        // Find user by stripe_customer_id
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single();

        if (profile) {
            await supabaseAdmin.from('profiles').update({
                subscription_status: subscription.status
            }).eq('id', profile.id);
        }
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as any;
        // Find user by stripe_customer_id
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single();

        if (profile) {
            await supabaseAdmin.from('profiles').update({
                subscription_status: "canceled"
            }).eq('id', profile.id);
        }
    }

    return NextResponse.json({ received: true });
}
