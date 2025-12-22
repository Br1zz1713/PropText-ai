"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function Pricing() {
    const [subscribeHref, setSubscribeHref] = useState("/signup?plan=pro");
    const [starterHref, setStarterHref] = useState("/signup");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setSubscribeHref("/dashboard/billing");
                setStarterHref("/dashboard");
                setIsLoggedIn(true);
            }
        };
        checkUser();
    }, [supabase]);

    return (
        <section id="pricing" className="py-24 bg-[#030712] border-t border-white/5">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Simple Pricing
                    </h2>
                    <p className="mt-4 text-base text-slate-400">
                        Start free, upgrade when you scale
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl flex flex-col hover:border-white/20 transition-all">
                        <h3 className="text-lg font-semibold text-white">Starter</h3>
                        <p className="mt-2 text-sm text-slate-400">Perfect for trying it out</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold tracking-tight text-white">Free</span>
                        </div>
                        <ul className="mt-8 space-y-4 flex-1">
                            {['3 Listing Credits', 'All Languages', 'Basic Editing', 'Community Support'].map((feature, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-300">
                                    <div className="rounded-full bg-white/10 p-1">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={starterHref}
                            className="mt-8 block rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white transition-all hover:bg-white/10"
                        >
                            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="relative rounded-2xl border border-indigo-500/50 bg-indigo-500/5 p-8 shadow-2xl shadow-indigo-500/10 flex flex-col text-left">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
                            MOST POPULAR
                        </div>
                        <h3 className="text-lg font-semibold text-indigo-400">Pro Agent</h3>
                        <p className="mt-2 text-sm text-slate-400">For serious realtors</p>
                        <div className="mt-6 flex items-baseline gap-1">
                            <span className="text-4xl font-bold tracking-tight text-white">$29</span>
                            <span className="text-sm font-medium text-slate-500">/month</span>
                        </div>
                        <ul className="mt-8 space-y-4 flex-1">
                            {['Unlimited Listings', '24/7 Priority Support', 'Usage History', 'Early Access', 'Advanced Styles'].map((feature, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-300 font-medium">
                                    <div className="rounded-full bg-indigo-500/20 p-1">
                                        <Check className="h-3 w-3 text-indigo-400" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={subscribeHref}
                            className="mt-8 block rounded-xl bg-indigo-600 px-6 py-4 text-center text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
