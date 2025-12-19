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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-sm">
            <h1 className="text-sm font-semibold text-foreground lg:hidden">PropText.ai</h1>

            <div className="ml-auto flex items-center gap-6">
                {/* Credits Badge - Pill Style */}
                <div className="flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/20 px-3 py-1.5 border border-green-200 dark:border-green-800">
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        credits > 0 ? "bg-green-500" : "bg-red-500"
                    )}></div>
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                        {credits} / 3 Credits
                    </span>
                </div>

                <ThemeToggle />

                <div className="flex items-center gap-3 pl-6 border-l border-border">
                    <div className="group relative">
                        {user?.user_metadata?.avatar_url ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full avatar-glow transition-transform duration-200 group-hover:scale-105">
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground avatar-glow">
                                <User size={20} />
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500 shadow-sm"></div>
                    </div>

                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-foreground leading-none">
                            {user?.user_metadata?.full_name || "User"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="ml-2 flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
