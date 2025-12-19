"use client";

import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Generator", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Listings", href: "/dashboard/listings", icon: FileText },
    { name: "Billing", href: "/dashboard/billing", icon: Settings },
    { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-border bg-card px-4 py-8 lg:flex transition-all duration-300">
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon
                                size={18}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="rounded-xl border border-border bg-accent/50 p-4">
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pro Tip</h4>
                <p className="text-xs text-muted-foreground">
                    Use <span className="font-semibold text-foreground">specific</span> keywords for better AI results.
                </p>
            </div>
        </aside>
    );
}
