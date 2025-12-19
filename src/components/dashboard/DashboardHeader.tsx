"use client";

import { createClient } from "@/utils/supabase/client";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/50 px-6 backdrop-blur-xl">
            <h1 className="text-xl font-bold text-gray-900 lg:hidden">PropText.ai</h1>

            <div className="ml-auto flex items-center gap-4">
                {/* Credits Badge */}
                <div className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1",
                    credits > 0
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-red-50 text-red-700 ring-red-600/20"
                )}>
                    <span>Credits:</span>
                    <span>{credits}/3</span>
                </div>

                <div className="flex items-center gap-3 rounded-full bg-white/50 px-3 py-1.5 shadow-sm ring-1 ring-gray-200/50">
                    {user?.user_metadata?.avatar_url ? (
                        <Image
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <User size={16} />
                        </div>
                    )}
                    <span className="hidden text-sm font-medium text-gray-700 sm:block">
                        {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                    </span>
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100/80 hover:text-red-600 transition-colors"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
