"use client";

import { Check, Zap, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
    const currentPlan = "free";
    const creditsUsed = 3;
    const creditsTotal = 10;
    const usagePercentage = (creditsUsed / creditsTotal) * 100;

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Header & Usage Stats */}
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-foreground">Billing & Plans</h1>
                    <p className="text-muted-foreground mt-1">Manage your subscription and credits.</p>
                </div>

                {/* Credit Usage Bar */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap size={18} className="text-amber-400 fill-amber-400/20" />
                            <h3 className="font-semibold text-foreground">Monthly Credits</h3>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            <span className="text-foreground font-bold">{creditsUsed}</span> / {creditsTotal} used
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-black/40 border border-white/5">
                        <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                            style={{ width: `${usagePercentage}%` }}
                        >
                            <div className="absolute right-0 top-0 h-full w-[1px] bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                        Resets on <span className="text-foreground">Nov 1, 2023</span>. Upgrade for unlimited generation.
                    </p>
                </div>
            </div>

            {/* Plans Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                {/* Starter Plan */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div>
                        <h3 className="text-lg font-medium text-muted-foreground">Starter</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-foreground">$0</span>
                            <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Perfect for trying out PropText.</p>
                    </div>
                    <ul className="space-y-3">
                        {["10 Credits / month", "Standard Speed", "Basic Support", "Email Export"].map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Check size={16} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button disabled className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan (Highlighted) */}
                <div className="relative md:-mt-8 rounded-2xl border border-white/20 bg-background/60 p-8 space-y-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl ring-1 ring-white/10 group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        POPULAR
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl pointer-events-none" />

                    <div className="relative">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            Pro Agent
                            <SparklesIcon size={16} className="text-indigo-400" />
                        </h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-foreground tracking-tight">$49</span>
                            <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-2 text-sm text-indigo-200/70">For high-volume agents.</p>
                    </div>
                    <ul className="space-y-4 relative">
                        {["Unlimited Credits", "Turbo Generation", "Priority Support", "All Languages", "SEO Optimization", "Commercial & Residential"].map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                    <Check size={12} strokeWidth={3} />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]">
                        Upgrade to Pro
                    </button>
                    <div className="text-center">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">7-Day Money Back Guarantee</span>
                    </div>
                </div>

                {/* Agency Plan */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-6 hover:bg-white/[0.04] transition-colors">
                    <div>
                        <h3 className="text-lg font-medium text-foreground">Agency</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-foreground">$199</span>
                            <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Custom seats for whole teams.</p>
                    </div>
                    <ul className="space-y-3">
                        {["5+ Seats", "Admin Dashboard", "API Access", "Custom Branding", "Dedicated Account Manager"].map((feature) => (
                            <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Check size={16} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors">
                        Contact Sales
                    </button>
                </div>

            </div>

            {/* Payment Methods (Visual Only) */}
            <div className="border-t border-white/10 pt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Payment Methods</h4>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                        <CreditCard size={20} className="text-foreground" />
                        <span className="text-sm text-foreground">•••• 4242</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-medium">Default</span>
                    </div>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        + Add Method
                    </button>
                </div>
            </div>

        </div>
    );
}

function SparklesIcon({ className, size }: { className?: string; size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    );
}
