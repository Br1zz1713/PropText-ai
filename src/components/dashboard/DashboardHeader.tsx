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
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/40 bg-white/40 px-8 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/50 dark:bg-slate-900/40">
            <h1 className="text-xl font-bold text-gray-900 lg:hidden dark:text-gray-100">PropText.ai</h1>

            <div className="ml-auto flex items-center gap-4">
                {/* Credits Badge */}
                <div className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm ring-1 ring-inset backdrop-blur-md transition-all",
                    credits > 0
                        ? "bg-emerald-50/50 text-emerald-700 ring-emerald-500/30 shadow-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20"
                        : "bg-red-50/50 text-red-700 ring-red-500/30 shadow-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20"
                )}>
                    <span className="relative flex h-2 w-2">
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", credits > 0 ? "bg-emerald-400" : "bg-red-400")}></span>
                        <span className={cn("relative inline-flex rounded-full h-2 w-2", credits > 0 ? "bg-emerald-500" : "bg-red-500")}></span>
                    </span>
                    <span>{credits} / 3 Credits</span>
                </div>

                <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>

                <ThemeToggle />

                <div className="flex items-center gap-3 pl-2">
                    <div className="group relative">
                        {user?.user_metadata?.avatar_url ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white ring-offset-2 ring-offset-indigo-50 shadow-md transition-transform duration-200 group-hover:scale-105 dark:ring-slate-800 dark:ring-offset-slate-900">
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-white text-indigo-600 ring-2 ring-white ring-offset-2 ring-offset-indigo-50 shadow-md dark:from-indigo-900 dark:to-slate-800 dark:text-indigo-400 dark:ring-slate-800 dark:ring-offset-slate-900">
                                <User size={20} />
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm dark:border-slate-900"></div>
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800 leading-none dark:text-gray-200">
                            {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Free Plan</p>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center rounded-full p-2.5 text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-md ring-1 ring-transparent hover:ring-gray-100 transition-all duration-200 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-red-400 dark:hover:ring-slate-700"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
