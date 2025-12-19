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
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
            <h1 className="text-sm font-semibold text-foreground lg:hidden">PropText.ai</h1>

            <div className="ml-auto flex items-center gap-4">
                {/* Credits Badge - Simplified */}
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    <span className={cn("flex h-1.5 w-1.5 rounded-full", credits > 0 ? "bg-emerald-500" : "bg-red-500")}></span>
                    <span>{credits} / 3</span>
                </div>

                <div className="h-4 w-px bg-border mx-2"></div>

                <ThemeToggle />

                <div className="flex items-center gap-4 pl-4 border-l border-border ml-2">
                    <div className="group relative">
                        {user?.user_metadata?.avatar_url ? (
                            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-background border border-border shadow-sm transition-transform duration-200 group-hover:scale-105">
                                <Image
                                    src={user.user_metadata.avatar_url || user.user_metadata.picture}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground ring-2 ring-background border border-border shadow-sm">
                                <User size={16} />
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
