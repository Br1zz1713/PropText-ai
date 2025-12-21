"use client";

import { Bell, Moon, Sun, User, Sparkles, LogOut, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCredits } from "@/components/CreditsProvider";
import Link from "next/link";
import { navItems } from "@/config/navigation";

export default function DashboardHeader() {
    const { credits } = useCredits(); // Use shared context
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
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

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    if (!mounted) return null;

    return (
        <>
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl transition-all duration-500 ease-in-out">
                {/* Left: Brand & Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Mobile Hamburger */}
                    <button
                        className="lg:hidden p-2 -ml-2 mr-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

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

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-[280px] h-full bg-card border-r border-border p-6 shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                    <Sparkles size={16} />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-foreground">
                                    PropText
                                </span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary/10 text-primary border border-primary/10"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <Icon size={18} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile Credits Display */}
                        <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border/50">
                            <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                <span className={cn(
                                    "h-2 w-2 rounded-full",
                                    credits > 0 ? "bg-emerald-500" : "bg-rose-500"
                                )} />
                                <span className="text-foreground">{credits} Credits Remaining</span>
                            </div>
                            <Link href="/dashboard/billing" className="text-xs text-primary hover:underline">
                                Upgrade Plan &rarr;
                            </Link>
                        </div>

                        <div className="mt-auto pt-8 border-t border-border/40">
                            <button
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
