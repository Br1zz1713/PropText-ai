"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Settings, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/dashboard", label: "Generator", icon: PenTool },
    { href: "/dashboard/history", label: "My Listings", icon: History },
    { href: "/dashboard/billing", label: "Billing", icon: Settings },
];

interface DashboardSidebarProps { }

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col justify-between">
            <div>
                <div className="flex h-16 items-center px-6 border-b border-gray-100">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-gray-900">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <LayoutDashboard size={18} />
                        </div>
                        PropText.ai
                    </Link>
                </div>

                <nav className="p-4 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={18} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100">
                <Link
                    href="/dashboard/billing"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                    <Settings size={18} />
                    Settings & Billing
                </Link>
            </div>
        </aside>
    );
}
