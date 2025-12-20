"use client";

import { Copy, FileText, MoreVertical, Calendar, ArrowUpRight } from "lucide-react";

const mockListings = [
    {
        id: 1,
        title: "Luxury Penthouse in Manhattan",
        type: "Penthouse",
        date: "Oct 24, 2023",
        preview: "Experience unparalleled luxury in this stunning penthouse suite located in the heart of..."
    },
    {
        id: 2,
        title: "Modern Studio in Berlin",
        type: "Studio",
        date: "Oct 22, 2023",
        preview: "Compact yet sophisticated living space designed for the modern professional..."
    },
    {
        id: 3,
        title: "Seaside Villa, Malibu",
        type: "Villa",
        date: "Oct 20, 2023",
        preview: "Wake up to the sound of waves in this breathtaking seaside villa featuring..."
    },
    {
        id: 4,
        title: "Commercial Office Space",
        type: "Commercial",
        date: "Oct 18, 2023",
        preview: "Prime commercial real estate location with high foot traffic and modern amenities..."
    },
    {
        id: 5,
        title: "Cozy Cottage in Cotswolds",
        type: "House",
        date: "Oct 15, 2023",
        preview: "Charming traditional cottage with thatched roof and beautiful garden..."
    },
];

export default function ListingsPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-foreground">My Listings</h1>
                    <p className="text-muted-foreground mt-1">Access your saved property descriptions.</p>
                </div>
                <button className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:border-white/20">
                    <ArrowUpRight size={16} />
                    Export All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockListings.map((listing) => (
                    <div
                        key={listing.id}
                        className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1"
                    >
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
                                {listing.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                    {listing.type}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {listing.date}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground/80 line-clamp-3 mb-6 font-serif">
                                {listing.preview}
                            </p>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                            <button className="text-xs font-medium text-foreground hover:underline decoration-indigo-500/50 underline-offset-4">
                                View Full
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-md">
                                <Copy size={12} />
                                Copy
                            </button>
                        </div>
                    </div>
                ))}

                {/* 'New' Action Card */}
                <div className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/10 bg-transparent p-5 text-center transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer min-h-[250px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                        <ArrowUpRight size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Create New</h3>
                        <p className="text-sm text-muted-foreground">Generate a new listing</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
