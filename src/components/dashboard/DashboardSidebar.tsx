"use client";

import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Generator", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Listings", href: "/dashboard/listings", icon: FileText },
    { name: "Billing", href: "/dashboard/billing", icon: Settings }, // Using Settings icon for Billing/Plan management
    { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center border-b border-border/40 px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <div className="h-3 w-3 rounded-sm bg-primary" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                        PropText
                    </span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group border border-transparent",
                                isActive
                                    ? "bg-primary/10 text-primary border-primary/10 shadow-[0_0_10px_-4px_rgba(var(--primary),0.5)]"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border/30"
                            )}
                        >
                            <Icon size={16} className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section: Minimal User Info or Version */}
            <div className="p-4 border-t border-border/40">
                <div className="rounded-lg bg-card/50 border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground font-medium text-center">
                        PropText Pro <span className="text-primary">•</span> v2.0
                    </p>
                </div>
            </div>
        </aside>
    );
}
