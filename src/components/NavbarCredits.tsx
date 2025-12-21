"use client";

import { useCredits } from "@/components/CreditsProvider";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";

export default function NavbarCredits() {
    const { credits, subscriptionStatus } = useCredits();

    // Check if credits are explicitly high (from provider override) or status is active
    const isPro = subscriptionStatus === "active" || (credits !== null && credits > 9000);

    if (credits === null || credits === undefined) {
        return (
            <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <Link
            href="/dashboard/billing"
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${isPro
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 shadow-[0_0_10px_-3px_rgba(99,102,241,0.4)]"
                    : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
        >
            <Zap size={14} className={isPro ? "fill-indigo-500 text-indigo-500" : "text-amber-400"} />
            <span>{isPro ? "Unlimited Credits" : `${credits} Credits`}</span>
        </Link>
    );
}
