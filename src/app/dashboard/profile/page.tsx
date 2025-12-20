"use client";

import { User, Shield, Key, LogOut, Bell, Smartphone } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-12">Profile & Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

                {/* Left Column: Identity (Span 4) */}
                <div className="md:col-span-4 space-y-6">
                    <div className="relative group rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative mb-4">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/20">
                                <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                    {/* Placeholder Avatar */}
                                    <User size={40} className="text-muted-foreground" />
                                    {/* <img src="..." /> */}
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                <div className="h-2 w-2 rounded-full bg-current" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-foreground">John Doe</h2>
                        <p className="text-sm text-muted-foreground">Premium Agent</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-1">
                        <nav className="flex flex-col space-y-1">
                            <button className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-foreground transition-colors">
                                <User size={16} />
                                Personal Info
                            </button>
                            <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
                                <Shield size={16} />
                                Security
                            </button>
                            <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
                                <Bell size={16} />
                                Notifications
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Right Column: Details (Span 8) */}
                <div className="md:col-span-8 space-y-8">

                    {/* Section: Personal Info */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-semibold text-foreground border-b border-white/10 pb-4">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="John Doe"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground focus:border-indigo-500 focus:bg-background outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="john@example.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground focus:border-indigo-500 focus:bg-background outline-none transition-all"
                                />
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agency Name</label>
                                <input
                                    type="text"
                                    defaultValue="Cipher Real Estate Labs"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground focus:border-indigo-500 focus:bg-background outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: API Key */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h3 className="text-lg font-semibold text-foreground">API Configuration</h3>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Secret Key</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Key size={16} />
                                </div>
                                <input
                                    type="password"
                                    defaultValue="sk_live_51M..."
                                    readOnly
                                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-24 py-3 text-sm font-mono text-muted-foreground focus:text-foreground focus:border-indigo-500 focus:bg-background outline-none transition-all"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors">
                                    Reveal
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">Never share your API key. View documentation for usage limits.</p>
                        </div>
                    </section>

                    {/* Section: Danger Zone */}
                    <section className="pt-8 border-t border-white/10 pb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-foreground">Sign Out</h4>
                                <p className="text-xs text-muted-foreground">Securely end your current session.</p>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
