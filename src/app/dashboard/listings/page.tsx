"use client";

import { createClient } from "@/utils/supabase/client";
import { ArrowUpRight, Loader2 } from "lucide-react";
import ListingCard from "@/components/dashboard/ListingCard";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ListingsPage() {
    const supabase = createClient();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from("listings")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) {
                    throw error;
                }

                setListings(data || []);
            } catch (error) {
                console.error("Error fetching listings:", error);
                toast.error("Failed to load listings");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-foreground">My Listings</h1>
                    <p className="text-muted-foreground mt-1">Access your saved property descriptions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}

                {/* 'New' Action Card */}
                <Link href="/dashboard" className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/10 bg-transparent p-5 text-center transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer min-h-[250px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                        <ArrowUpRight size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Create New</h3>
                        <p className="text-sm text-muted-foreground">Generate a new listing</p>
                    </div>
                </Link>
            </div>

            {listings.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No listings found. Create your first one!
                </div>
            )}
        </div>
    );
}
