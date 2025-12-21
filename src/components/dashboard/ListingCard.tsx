"use client";

import { Calendar, Copy, FileText, MoreVertical, Trash2, Edit, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface ListingCardProps {
    listing: {
        id: number;
        title: string;
        type: string; // db column is property_type usually, check mapping
        created_at: string;
        description: string;
        property_details: any; // Add this
    };
}

import ListingModal from "./ListingModal";

export default function ListingCard({ listing }: ListingCardProps) {
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(listing.description);
        setCopied(true);
        toast.success("Copied description");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
        setDeleting(true);
        try {
            const { error } = await supabase.from("listings").delete().eq("id", listing.id);
            if (error) throw error;
            toast.success("Listing deleted");
            router.refresh();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete listing");
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = () => {
        setIsModalOpen(true);
    };

    const formattedDate = new Date(listing.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    if (deleting) return null; // Optimistic hide

    return (
        <>
            <ListingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                listing={listing}
            />

            <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                            <FileText size={20} />
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleEdit}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {listing.title || "Untitled Listing"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <span className="px-2 py-0.5 rounded-full bg-secondary border border-border">
                            {listing.type}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formattedDate}
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground/80 line-clamp-3 mb-6 font-serif">
                        {listing.description}
                    </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-border flex items-center justify-between">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-medium text-foreground hover:underline decoration-indigo-500/50 underline-offset-4 flex items-center gap-1"
                    >
                        <Eye size={12} /> View Full
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary hover:bg-secondary/80 px-2.5 py-1.5 rounded-md"
                    >
                        <Copy size={12} />
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            </div>
        </>
    );
}
