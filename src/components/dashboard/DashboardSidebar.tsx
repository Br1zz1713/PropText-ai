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
        <aside className="hidden w-64 border-r border-white/40 bg-white/40 backdrop-blur-xl lg:flex lg:flex-col justify-between transition-all duration-300">
            <div>
                <div className="flex h-20 items-center px-6">
                    <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight text-slate-900">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                            <LayoutDashboard size={20} />
                        </div>
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">PropText.ai</span>
                    </Link>
                </div>

                <nav className="px-4 py-2 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-500/20 translate-x-1"
                                        : "text-slate-600 hover:bg-white/60 hover:text-indigo-700 hover:shadow-sm"
                                )}
                            >
                                <Icon size={20} className={cn("transition-transform", isActive && "scale-105")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-4 border border-white/60 shadow-sm">
                    <p className="text-xs font-semibold text-indigo-900 mb-2">Need help?</p>
                    <Link
                        href="/dashboard/billing"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-indigo-600 shadow-sm ring-1 ring-indigo-100 hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                        <Settings size={16} />
                        Manage Subscription
                    </Link>
                </div>
            </div>
        </aside>
    );
}
