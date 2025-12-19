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
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-[#374151] bg-[#1F2937] px-3 py-6 text-gray-200 transition-all lg:flex">
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#374151] text-white"
                                    : "text-gray-400 hover:bg-[#374151]/50 hover:text-white"
                            )}
                        >
                            <item.icon
                                size={18}
                                strokeWidth={2}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-[#6366f1]" : "text-gray-500 group-hover:text-gray-300"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="rounded-lg bg-[#374151]/50 p-4 border border-[#374151]">
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Pro Tip</h4>
                <p className="text-xs text-gray-500">
                    Use <span className="font-semibold text-gray-300">specific</span> keywords.
                </p>
            </div>
        </aside>
    );
}
