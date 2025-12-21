"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, CreditCard, Zap, History, Check, Shield, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { useCredits } from "@/components/CreditsProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function BillingPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    // const [profile, setProfile] = useState<any>(null); // Removed local profile state, using context
    const [generations, setGenerations] = useState<any[]>([]);
    const { credits, subscriptionStatus, refreshCredits } = useCredits(); // Use shared context
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

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

    const handleMockUpgrade = async () => {
        setIsUpgrading(true);

        // 1. Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("User not found");
                return;
            }

            // 2. Update Profile to Mock Pro
            const { error } = await supabase
                .from("profiles")
                .update({ subscription_status: 'active' })
                .eq("id", user.id);

            if (error) {
                console.error("Mock Upgrade Failed:", error);
                toast.error("Upgrade failed (Database Error)");
            } else {
                // 3. Success
                await refreshCredits(); // Sync context
                setShowSuccess(true);
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsUpgrading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        );
    }

    const isPro = subscriptionStatus === 'active';

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Success Modal Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                            onClick={() => setShowSuccess(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-card p-1 shadow-2xl"
                        >
                            <div className="rounded-[20px] border border-border bg-gradient-to-br from-indigo-500/10 via-background to-background p-8 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                                    <PartyPopper size={40} className="animate-bounce" />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Welcome to Pro! 🚀</h2>
                                <p className="mb-8 text-muted-foreground">
                                    Your account has been upgraded. You now have <strong>Unlimited Credits</strong> and priority access.
                                </p>
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Start Creating
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div>
                <h1 className="text-3xl font-bold tracking-tighter text-foreground">Billing & Credits</h1>
                <p className="text-muted-foreground mt-1">Manage your plan and view usage history.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Credit Balance Card */}
                <div className="rounded-3xl border border-border bg-card p-8 relative overflow-hidden group">
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
                        <div className="text-5xl font-bold text-foreground mb-2">
                            {isPro ? "∞" : credits}
                        </div>
                        <p className="text-muted-foreground">
                            {isPro ? "Unlimited Credits (Pro Plan)" : "Free Credits Remaining"}
                        </p>
                    </div>
                </div>

                {/* Plan Status Card */}
                <div className="rounded-3xl border border-border bg-card p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Current Plan</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                You are currently on the <span className="text-foreground font-semibold">{isPro ? "Pro" : "Free"}</span> plan.
                            </p>
                        </div>
                        {isPro && (
                            <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                ACTIVE
                            </div>
                        )}
                    </div>

                    {!isPro ? (
                        <button
                            onClick={handleMockUpgrade}
                            disabled={isUpgrading}
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isUpgrading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing...
                                </>
                            ) : (
                                "Upgrade to Pro"
                            )}
                        </button>
                    ) : (
                        <button className="w-full py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors cursor-not-allowed opacity-50">
                            Manage Subscription (Demo)
                        </button>
                    )}
                </div>
            </div>

            {/* Pricing Grid (Visualization of Account-Credits Correspondence) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Free Tier */}
                <div className={`rounded-3xl border p-8 ${!isPro ? 'border-primary/50 bg-primary/5' : 'border-border bg-card/50'}`}>
                    <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Starter</span>
                        <h3 className="text-2xl font-bold text-foreground mt-1">Free</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Check size={16} className="text-emerald-400" /> 3 Credits / Month
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Check size={16} className="text-emerald-400" /> Standard Generation Speed
                        </li>
                        <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Check size={16} className="text-emerald-400" /> Basic Support
                        </li>
                    </ul>
                </div>

                {/* Pro Tier */}
                <div className={`rounded-3xl border p-8 relative overflow-hidden ${isPro ? 'border-primary/50 bg-primary/10' : 'border-border bg-card/50'}`}>
                    {!isPro && <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>}
                    <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Professional</span>
                        <h3 className="text-2xl font-bold text-foreground mt-1">$29<span className="text-sm font-medium text-muted-foreground">/mo</span></h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check size={16} className="text-indigo-400" /> <span className="font-bold">Unlimited Credits</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check size={16} className="text-primary" /> Priority Generation (Faster)
                        </li>
                        <li className="flex items-center gap-3 text-sm text-foreground">
                            <Check size={16} className="text-indigo-400" /> Premium Support
                        </li>
                    </ul>
                </div>
            </div>

            {/* Usage History */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <History size={20} className="text-muted-foreground" />
                    <h3 className="font-bold text-foreground">Usage History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Cost</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                            {generations.map((gen) => (
                                <tr key={gen.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(gen.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">Standard Generation</td>
                                    <td className="px-6 py-4">
                                        {gen.cost > 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold">
                                                -{gen.cost} Credit
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                                Free (Pro)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                                        {JSON.stringify(gen.input_data).slice(0, 30)}...
                                    </td>
                                </tr>
                            ))}
                            {generations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
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
