"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface CreditsContextType {
    credits: number;
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
    const supabase = createClient();
    const router = useRouter();

    const refreshCredits = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .select("credits_remaining")
            .eq("id", user.id)
            .single();

        if (data) {
            setCredits(data.credits_remaining);
            router.refresh();
        }
    };

    useEffect(() => {
        const fetchUserAndSubscribe = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Initial fetch to be sure
            // (Client side might be slightly out of sync with server fetch if it changed in ms)
            // But we trust initialCredits for now to avoid flicker, just subscribe.

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
                        console.log('Credit update received:', payload);
                        const newCredits = (payload.new as any).credits_remaining;
                        setCredits(newCredits);
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

    return (
        <CreditsContext.Provider value={{ credits, refreshCredits }}>
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
