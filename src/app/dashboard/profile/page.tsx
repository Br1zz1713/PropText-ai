"use client";

import { User, Shield, Key, LogOut, Bell, Loader2, Save, Check, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useCredits } from "@/components/CreditsProvider";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Branding State
    const [agencyName, setAgencyName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                setProfile(data);
                if (data) {
                    setAgencyName(data.agency_name || "");
                    setPhoneNumber(data.phone_number || "");
                }
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    agency_name: agencyName,
                    phone_number: phoneNumber
                })
                .eq("id", user.id);

            if (error) throw error;
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        );
    }

    if (!user) return null;

    const fullName = user.user_metadata?.full_name || "User";
    const email = user.email;
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const subscription = profile?.subscription_status === 'active' ? 'Pro Agent' : 'Free Plan';
    const { credits } = useCredits();

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-12">Profile & Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

                {/* Left Column: Identity (Span 4) */}
                <div className="md:col-span-4 space-y-6">
                    <div className="relative group rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative mb-4">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/20">
                                <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden relative">
                                    {avatarUrl ? (
                                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                                    ) : (
                                        <User size={40} className="text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mt-1">{subscription}</p>

                        {/* Credits Display */}
                        <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium border border-border">
                            <CreditCard size={14} className="text-emerald-400" />
                            <span className="text-emerald-400">{credits} Credits</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-1">
                        <nav className="flex flex-col space-y-1">
                            <button className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-colors w-full">
                                <User size={16} />
                                Personal Info
                            </button>
                            <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full">
                                <Shield size={16} />
                                Security
                            </button>
                            <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full">
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
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-4">Personal Information</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={fullName}
                                    className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-background outline-none transition-all"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={email}
                                    className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-background outline-none transition-all"
                                    readOnly
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: Branding & Contact */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <h3 className="text-lg font-semibold text-foreground">Branding & Contact</h3>
                            <span className="text-xs text-muted-foreground">Used for auto-signatures</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agency Name</label>
                                <input
                                    type="text"
                                    value={agencyName}
                                    onChange={(e) => setAgencyName(e.target.value)}
                                    placeholder="e.g. Luxury Estates"
                                    className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-background outline-none transition-all placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="e.g. +1 (555) 000-0000"
                                    className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-background outline-none transition-all placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </section>

                    {/* Section: Danger Zone */}
                    <section className="pt-8 border-t border-border pb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-foreground">Sign Out</h4>
                                <p className="text-xs text-muted-foreground">Securely end your current session.</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                            >
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
