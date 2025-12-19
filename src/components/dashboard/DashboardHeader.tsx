"use client";

import { createClient } from "@/utils/supabase/client";
import { LogOut, User, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle"; // Verify this path is correct

import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    credits: number;
}

export default function DashboardHeader({ credits }: DashboardHeaderProps) {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl transition-all">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                </div>
                <h1 className="text-sm font-bold tracking-tight text-foreground hidden sm:block">PropText.ai</h1>
            </div>

            <div className="ml-auto flex items-center gap-4 sm:gap-6">
                {/* Credits Badge - Premium Pill Style */}
                <div className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-colors",
                    credits > 0
                        ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400"
                )}>
                    <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        credits > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    )}></div>
                    <span>{credits} Credits</span>
                </div>

                <div className="h-6 w-px bg-border/50"></div>

                <ThemeToggle />

                <div className="flex items-center gap-3">
                    <div className="group relative">
                        {user?.user_metadata?.avatar_url && !avatarError ? (
                            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-background transition-transform duration-200 group-hover:scale-105">
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={() => setAvatarError(true)}
                                />
                            </div>
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-2 ring-background transition-transform duration-200 group-hover:scale-105">
                                <User size={18} />
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm"></div>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
