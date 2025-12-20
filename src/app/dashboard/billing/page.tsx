"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, CreditCard, Zap, History, Check, Shield } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [generations, setGenerations] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch Profile
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(profileData);

                // Fetch Usage History (Generations)
                const { data: genData } = await supabase
                    .from("generations")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(10);

                setGenerations(genData || []);

            } catch (error) {
                console.error("Error loading billing data:", error);
                toast.error("Failed to load billing info");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        );
    }

    const isPro = profile?.subscription_status === 'active';

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tighter text-foreground">Billing & Credits</h1>
                <p className="text-muted-foreground mt-1">Manage your plan and view usage history.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Credit Balance Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-emerald-400">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <CreditCard size={20} />
                            </div>
                            <span className="font-bold uppercase tracking-widest text-xs">Balance</span>
                        </div>
                        <div className="text-5xl font-bold text-white mb-2">
                            {isPro ? "∞" : profile?.credits_remaining ?? 0}
                        </div>
                        <p className="text-muted-foreground">
                            {isPro ? "Unlimited Credits (Pro Plan)" : "Free Credits Remaining"}
                        </p>
                    </div>
                </div>

                {/* Plan Status Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Current Plan</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                You are currently on the <span className="text-white font-semibold">{isPro ? "Pro" : "Free"}</span> plan.
                            </p>
                        </div>
                        {isPro && (
                            <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                ACTIVE
                            </div>
                        )}
                    </div>

                    {!isPro ? (
                        <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors">
                            Upgrade to Pro
                        </button>
                    ) : (
                        <button className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                            Manage Subscription
                        </button>
                    )}
                </div>
            </div>

            {/* Pricing Grid (Visualization of Account-Credits Correspondence) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Free Tier */}
                <div className={`rounded-3xl border p-8 ${!isPro ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 bg-white/5'}`}>
                    <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Starter</span>
                        <h3 className="text-2xl font-bold text-white mt-1">Free</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-slate-300">
                            <Check size={16} className="text-emerald-400" /> 3 Credits / Month
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-300">
                            <Check size={16} className="text-emerald-400" /> Standard Generation Speed
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-300">
                            <Check size={16} className="text-emerald-400" /> Basic Support
                        </li>
                    </ul>
                </div>

                {/* Pro Tier */}
                <div className={`rounded-3xl border p-8 relative overflow-hidden ${isPro ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}>
                    {!isPro && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>}
                    <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Professional</span>
                        <h3 className="text-2xl font-bold text-white mt-1">$29<span className="text-sm font-medium text-slate-500">/mo</span></h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Check size={16} className="text-indigo-400" /> <span className="font-bold">Unlimited Credits</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Check size={16} className="text-indigo-400" /> Priority Generation (Faster)
                        </li>
                        <li className="flex items-center gap-3 text-sm text-white">
                            <Check size={16} className="text-indigo-400" /> Premium Support
                        </li>
                    </ul>
                </div>
            </div>

            {/* Usage History */}
            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <History size={20} className="text-slate-400" />
                    <h3 className="font-bold text-white">Usage History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-xs font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Cost</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-slate-300">
                            {generations.map((gen) => (
                                <tr key={gen.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(gen.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">Standard Generation</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold">
                                            -1 Credit
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">
                                        {JSON.stringify(gen.input_data).slice(0, 30)}...
                                    </td>
                                </tr>
                            ))}
                            {generations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        No usage history yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
