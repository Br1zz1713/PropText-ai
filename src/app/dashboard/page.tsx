"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Copy, Check, Home, MapPin, Edit3 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

export default function GeneratorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const showWelcome = async () => {
            if (searchParams.get("welcome")) {
                const { data: { user } } = await supabase.auth.getUser();
                const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
                toast.success(`Welcome back, ${name}`);
                router.replace("/dashboard");
            }
        };
        showWelcome();
    }, [searchParams, router, supabase]);

    const [formData, setFormData] = useState({
        propertyType: "Apartment",
        sqMeters: "",
        bedrooms: "",
        bathrooms: "",
        location: "",
        amenities: "",
        usp: "",
        style: "Professional",
        language: "English",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setResult(data.description);
            router.refresh();
            toast.success("Description generated successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen pb-20 pt-8 sm:pt-12">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12 max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
                        Generator
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed font-medium tracking-tight">
                        Create premium property descriptions in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Control Panel (Span 7) */}
                    <div className="lg:col-span-7 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Card: Property Essentials */}
                            <div className="rounded-3xl border border-slate-200/50 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0b0f1a] transition-all hover:shadow-md">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        <Home size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Essentials</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="col-span-full">
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Property Type</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none"
                                        >
                                            <option>Apartment</option>
                                            <option>House</option>
                                            <option>Villa</option>
                                            <option>Penthouse</option>
                                            <option>Commercial Space</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Size (m²)</label>
                                        <input
                                            type="number"
                                            name="sqMeters"
                                            value={formData.sqMeters}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none placeholder:text-muted-foreground/40"
                                            placeholder="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Bedrooms</label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none placeholder:text-muted-foreground/40"
                                            placeholder="2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Location & Features */}
                            <div className="rounded-3xl border border-slate-200/50 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0b0f1a] transition-all hover:shadow-md">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
                                        <MapPin size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Location</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Address</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none placeholder:text-muted-foreground/40"
                                            placeholder="e.g. Downtown, New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Key Features</label>
                                        <textarea
                                            name="amenities"
                                            rows={3}
                                            value={formData.amenities}
                                            onChange={handleChange}
                                            className="w-full resize-none rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none placeholder:text-muted-foreground/40"
                                            placeholder="Balcony, Concierge, Rooftop pool..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Tone Settings */}
                            <div className="rounded-3xl border border-slate-200/50 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0b0f1a] transition-all hover:shadow-md">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <Edit3 size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Style</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Tone</label>
                                        <select
                                            name="style"
                                            value={formData.style}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none"
                                        >
                                            <option>Professional</option>
                                            <option>Luxury</option>
                                            <option>Warm</option>
                                            <option>Modern</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Language</label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-white focus:ring-1 focus:ring-black/20 dark:bg-white/5 dark:focus:bg-white/10 dark:focus:ring-white/20 outline-none"
                                        >
                                            <option>English</option>
                                            <option>German</option>
                                            <option>French</option>
                                            <option>Spanish</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-foreground px-8 py-4 text-base font-bold text-background transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        <span>Generate Description</span>
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    {/* Right Column: Magic Result (Span 5) - Strictly Sticky */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28 self-start">
                            <div className="relative min-h-[600px] overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-none transition-all duration-300">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                                    </div>
                                    {result && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-white transition-all dark:bg-white/10 dark:hover:bg-white/20"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    )}
                                </div>

                                {/* Content Area */}
                                <div className="p-8 sm:p-10">
                                    {loading ? (
                                        <div className="space-y-6 animate-pulse relative">
                                            {/* Apple-Style Skeleton */}
                                            <div className="h-4 w-3/4 rounded-full bg-slate-200/50 dark:bg-white/10" />
                                            <div className="h-4 w-full rounded-full bg-slate-200/50 dark:bg-white/10" />
                                            <div className="h-4 w-5/6 rounded-full bg-slate-200/50 dark:bg-white/10" />
                                            <div className="h-4 w-full rounded-full bg-slate-200/50 dark:bg-white/10" />
                                            <div className="h-4 w-2/3 rounded-full bg-slate-200/50 dark:bg-white/10" />

                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
                                        </div>
                                    ) : result ? (
                                        <div className="prose prose-lg dark:prose-invert max-w-none font-sans leading-relaxed text-foreground/90 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            {result}
                                        </div>
                                    ) : (
                                        <div className="flex h-[400px] flex-col items-center justify-center text-center opacity-40">
                                            <Sparkles className="h-12 w-12 text-foreground mb-6" strokeWidth={1} />
                                            <p className="text-sm font-medium tracking-widest uppercase">Ready to Generate</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
