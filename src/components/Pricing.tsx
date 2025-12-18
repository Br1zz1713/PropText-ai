import Link from "next/link";
import { Check } from "lucide-react";

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-indigo-50 blur-3xl opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Start for free, upgrade when you scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    {/* Free Tier */}
                    <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-soft flex flex-col hover:shadow-card transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-slate-900">Starter</h3>
                        <p className="mt-2 text-sm text-slate-500">Perfect for trying it out.</p>
                        <div className="mt-8 flex items-baseline">
                            <span className="text-5xl font-extrabold tracking-tight text-slate-900">Free</span>
                        </div>
                        <ul className="mt-10 space-y-4 flex-1">
                            {['3 Listing Credits', 'All Languages supported', 'Basic Editing tools', 'Community Support'].map((feature, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-600">
                                    <div className="rounded-full bg-slate-100 p-1">
                                        <Check className="h-3.5 w-3.5 text-slate-600" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/signup"
                            className="mt-10 block rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:border-slate-300"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="relative rounded-3xl border border-indigo-100 bg-white p-10 shadow-card flex flex-col ring-1 ring-indigo-50">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg tracking-wide uppercase">
                            Most Popular
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Pro Agent</h3>
                        <p className="mt-2 text-sm text-slate-500">For serious realtors.</p>
                        <div className="mt-8 flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold tracking-tight text-slate-900">€19</span>
                            <span className="text-sm font-semibold text-slate-500">/month</span>
                        </div>
                        <ul className="mt-10 space-y-4 flex-1">
                            {['Unlimited Listings', 'Priority Support (24/7)', 'Save Usage History', 'Early access to new features', 'Advanced Styles'].map((feature, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                                    <div className="rounded-full bg-indigo-50 p-1">
                                        <Check className="h-3.5 w-3.5 text-indigo-600" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/signup?plan=pro"
                            className="mt-10 block rounded-2xl bg-primary px-6 py-4 text-center text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-glow"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
