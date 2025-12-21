"use client";

import { Bell, Moon, Sun, User, Sparkles, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCredits } from "@/components/CreditsProvider";

export default function DashboardHeader() {
    const { credits } = useCredits(); // Use shared context
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.avatar_url) {
                setAvatarUrl(user.user_metadata.avatar_url);
            } else if (user?.user_metadata?.picture) {
                setAvatarUrl(user.user_metadata.picture);
            }
        };
        getUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl transition-all duration-500 ease-in-out">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Sparkles size={16} />
                </div>
                <span className="text-sm font-bold tracking-tight text-foreground hidden sm:block">
                    PropText.ai
                </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 sm:gap-6">

                {/* Credit Badge */}
                <div className={cn(
                    "hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all sm:flex",
                    credits > 0
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                        : "border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400"
                )}>
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        credits > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    )} />
                    {credits} Credits
                </div>

                <div className="h-4 w-[1px] bg-border/50 hidden sm:block" />

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background text-foreground transition-all duration-500 hover:border-foreground/20 hover:bg-accent focus:outline-none"
                    aria-label="Toggle theme"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
                </button>

                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background text-foreground transition-all duration-300 hover:border-foreground/20 hover:bg-accent focus:outline-none">
                    <Bell size={16} />
                    <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-background" />
                </button>

                {/* Avatar Profile */}
                <div className="relative group">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/50 bg-secondary shadow-sm transition-all duration-300 hover:ring-2 hover:ring-indigo-500/20 cursor-pointer">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Profile"
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-indigo-500/10 text-indigo-500">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="hidden sm:flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                    title="Sign Out"
                >
                    <LogOut size={16} />
                </button>

            </div>
        </header>
    );
}
