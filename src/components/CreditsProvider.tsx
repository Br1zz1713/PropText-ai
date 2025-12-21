"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export interface CreditsContextType {
    credits: number;
    subscriptionStatus: "free" | "active" | "canceled" | null;
    refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({
    children,
    initialCredits
}: {
    children: React.ReactNode;
    initialCredits: number;
}) {
    const [credits, setCredits] = useState(initialCredits);
    const [subscriptionStatus, setSubscriptionStatus] = useState<"free" | "active" | "canceled" | null>("free");
    const supabase = createClient();
    const router = useRouter();

    const refreshCredits = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .select("credits_remaining, subscription_status")
            .eq("id", user.id)
            .single();

        if (data) {
            setCredits(data.credits_remaining ?? 0);
            setSubscriptionStatus(data.subscription_status ?? "free");
            router.refresh();
        }
    };

    useEffect(() => {
        const fetchUserAndSubscribe = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Initial fetch
            const { data } = await supabase
                .from("profiles")
                .select("credits_remaining, subscription_status")
                .eq("id", user.id)
                .single();

            if (data) {
                setCredits(data.credits_remaining ?? 0);
                setSubscriptionStatus(data.subscription_status ?? "free");
            }

            const channel = supabase
                .channel('realtime-credits')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('Credit/Sub update received:', payload);
                        if (payload.new) {
                            if ("credits_remaining" in payload.new) {
                                setCredits((payload.new as any).credits_remaining);
                            }
                            if ("subscription_status" in payload.new) {
                                setSubscriptionStatus((payload.new as any).subscription_status);
                            }
                        }
                        router.refresh();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        fetchUserAndSubscribe();
    }, [supabase, router]);

    const isPro = subscriptionStatus === "active";
    const displayCredits = isPro ? 999999 : credits; // Internally use high number, consumers check isPro or display "Unlimited"

    return (
        <CreditsContext.Provider value={{ credits: displayCredits, subscriptionStatus, refreshCredits }}>
            {children}
        </CreditsContext.Provider>
    );
}

export function useCredits() {
    const context = useContext(CreditsContext);
    if (context === undefined) {
        throw new Error("useCredits must be used within a CreditsProvider");
    }
    return context;
}
