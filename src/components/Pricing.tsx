import Link from "next/link";
import { Check } from "lucide-react";

export function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Simple Pricing
                    </h2>
                    <p className="mt-3 text-base text-slate-600">
                        Start free, upgrade when you scale
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
                        <p className="mt-1 text-sm text-slate-500">Perfect for trying it out</p>
                        <div className="mt-6 flex items-baseline">
                            <span className="text-4xl font-bold tracking-tight text-slate-900">Free</span>
                        </div>
                        <ul className="mt-8 space-y-3 flex-1">
                            {['3 Listing Credits', 'All Languages', 'Basic Editing', 'Community Support'].map((feature, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600">
                                    <div className="rounded-full bg-slate-100 p-0.5 mt-0.5">
                                        <Check className="h-3.5 w-3.5 text-slate-600" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/signup"
                            className="mt-8 block rounded-lg border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="relative rounded-2xl border-2 border-primary/20 bg-white p-8 shadow-sm flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                            Popular
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Pro Agent</h3>
                        <p className="mt-1 text-sm text-slate-500">For serious realtors</p>
                        <div className="mt-6 flex items-baseline gap-1">
                            <span className="text-4xl font-bold tracking-tight text-slate-900">€19</span>
                            <span className="text-sm font-medium text-slate-500">/month</span>
                        </div>
                        <ul className="mt-8 space-y-3 flex-1">
                            {['Unlimited Listings', '24/7 Priority Support', 'Usage History', 'Early Access', 'Advanced Styles'].map((feature, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-700 font-medium">
                                    <div className="rounded-full bg-primary/10 p-0.5 mt-0.5">
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/signup?plan=pro"
                            className="mt-8 block rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-sm"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
