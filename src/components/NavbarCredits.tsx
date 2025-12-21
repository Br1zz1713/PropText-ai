"use client";

import { useCredits } from "@/components/CreditsProvider";
import { Loader2, Coins } from "lucide-react";
import Link from "next/link";

export default function NavbarCredits() {
    const { credits } = useCredits();

    if (credits === null || credits === undefined) {
        return (
            <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Credits</span>
            </div>
        );
    }

    return (
        <Link
            href="/dashboard/billing"
            className="group flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:border-primary/30"
        >
            <Coins className="h-4 w-4 text-primary group-hover:text-primary/80" />
            <span>
                {credits} <span className="hidden sm:inline">Credits</span>
            </span>
        </Link>
    );
}
