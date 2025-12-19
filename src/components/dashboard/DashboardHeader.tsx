"use client";

import { createClient } from "@/utils/supabase/client";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    credits: number;
}

export default function DashboardHeader({ credits }: DashboardHeaderProps) {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);

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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md transition-all duration-300">
            <h1 className="text-lg font-bold text-foreground lg:hidden">PropText.ai</h1>

            <div className="ml-auto flex items-center gap-4">
                {/* Credits Badge */}
                <div className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-all",
                    credits > 0
                        ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400"
                )}>
                    <span className="relative flex h-1.5 w-1.5">
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", credits > 0 ? "bg-emerald-500" : "bg-red-500")}></span>
                        <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", credits > 0 ? "bg-emerald-500" : "bg-red-500")}></span>
                    </span>
                    <span>{credits} / 3</span>
                </div>

                <div className="h-4 w-px bg-border mx-2"></div>

                <ThemeToggle />

                <div className="flex items-center gap-3 pl-2">
                    <div className="group relative">
                        {user?.user_metadata?.avatar_url ? (
                            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-background border border-border shadow-sm transition-transform duration-200 group-hover:scale-105">
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background border border-border shadow-sm">
                                <span className="text-xs font-bold">
                                    {user?.email?.[0].toUpperCase() || "U"}
                                </span>
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm"></div>
                    </div>

                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-foreground leading-none">
                            {user?.user_metadata?.full_name || "User"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="ml-2 flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
