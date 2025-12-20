"use client";

import { Calendar, Copy, FileText, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ListingCardProps {
    listing: {
        id: number;
        title: string;
        type: string;
        created_at: string;
        description: string;
    };
}

export default function ListingCard({ listing }: ListingCardProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(listing.description);
        setCopied(true);
        toast.success("Copied description");
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedDate = new Date(listing.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                        <FileText size={20} />
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical size={16} />
                    </button>
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {listing.title || "Untitled Listing"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
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

            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                <button className="text-xs font-medium text-foreground hover:underline decoration-indigo-500/50 underline-offset-4">
                    View Full
                </button>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-md"
                >
                    <Copy size={12} />
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
        </div>
    );
}
