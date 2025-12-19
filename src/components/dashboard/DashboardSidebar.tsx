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
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-background/50 backdrop-blur-sm">
            <div className="flex h-16 items-center border-b border-border px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight">
                        PropText<span className="text-primary">.ai</span>
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
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
