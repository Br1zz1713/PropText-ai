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
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const showWelcome = async () => {
            if (searchParams.get("welcome")) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest";
                    toast.success(`Welcome back, ${name}`);
                    router.replace("/dashboard");
                } catch (error) {
                    // Fail silently for auth bypass/guest mode
                    console.log("Guest access");
                }
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
        <div className="min-h-screen pb-20 pt-8 sm:pt-12 bg-[#030712] text-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12 max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                        Generator
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 leading-relaxed font-medium tracking-tight">
                        Create premium property descriptions in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Control Panel (Span 7) */}
                    <div className="lg:col-span-7 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Card: Property Essentials */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                                        <Home size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-white">Essentials</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="col-span-full">
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Property Type</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none"
                                        >
                                            <option className="bg-[#0b0f1a]">Apartment</option>
                                            <option className="bg-[#0b0f1a]">House</option>
                                            <option className="bg-[#0b0f1a]">Villa</option>
                                            <option className="bg-[#0b0f1a]">Penthouse</option>
                                            <option className="bg-[#0b0f1a]">Commercial Space</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Size (m²)</label>
                                        <input
                                            type="number"
                                            name="sqMeters"
                                            value={formData.sqMeters}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none placeholder:text-slate-600"
                                            placeholder="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Bedrooms</label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none placeholder:text-slate-600"
                                            placeholder="2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Location & Features */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400">
                                        <MapPin size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-white">Location</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Address</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none placeholder:text-slate-600"
                                            placeholder="e.g. Downtown, New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Key Features</label>
                                        <textarea
                                            name="amenities"
                                            rows={3}
                                            value={formData.amenities}
                                            onChange={handleChange}
                                            className="w-full resize-none rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none placeholder:text-slate-600"
                                            placeholder="Balcony, Concierge, Rooftop pool..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Tone Settings */}
                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                        <Edit3 size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-white">Style</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Tone</label>
                                        <select
                                            name="style"
                                            value={formData.style}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none"
                                        >
                                            <option className="bg-[#0b0f1a]">Professional</option>
                                            <option className="bg-[#0b0f1a]">Luxury</option>
                                            <option className="bg-[#0b0f1a]">Warm</option>
                                            <option className="bg-[#0b0f1a]">Modern</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Language</label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-white/5 border-transparent px-4 py-3.5 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none"
                                        >
                                            <option className="bg-[#0b0f1a]">English</option>
                                            <option className="bg-[#0b0f1a]">German</option>
                                            <option className="bg-[#0b0f1a]">French</option>
                                            <option className="bg-[#0b0f1a]">Spanish</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-base font-bold text-black transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
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
                        <div className="sticky top-24 self-start">
                            <div className="relative min-h-[600px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition-all duration-300">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                                    </div>
                                    {result && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={async () => {
                                                    setSaving(true);
                                                    try {
                                                        const res = await fetch("/api/listings", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                description: result,
                                                                ...formData
                                                            }),
                                                        });
                                                        if (!res.ok) throw new Error("Failed to save");
                                                        toast.success("Saved to My Listings");
                                                        router.refresh();
                                                    } catch (error) {
                                                        toast.error("Failed to save listing");
                                                    } finally {
                                                        setSaving(false);
                                                    }
                                                }}
                                                disabled={saving}
                                                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                {saving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                {copied ? "Copied" : "Copy"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Content Area */}
                                <div className="p-8 sm:p-10 text-white">
                                    {loading ? (
                                        <div className="space-y-6 animate-pulse relative">
                                            {/* Apple-Style Skeleton */}
                                            <div className="h-4 w-3/4 rounded-full bg-white/10" />
                                            <div className="h-4 w-full rounded-full bg-white/10" />
                                            <div className="h-4 w-5/6 rounded-full bg-white/10" />
                                            <div className="h-4 w-full rounded-full bg-white/10" />
                                            <div className="h-4 w-2/3 rounded-full bg-white/10" />

                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                        </div>
                                    ) : result ? (
                                        <div className="prose prose-lg prose-invert max-w-none font-sans leading-relaxed text-slate-200 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            {result}
                                        </div>
                                    ) : (
                                        <div className="flex h-[400px] flex-col items-center justify-center text-center opacity-40">
                                            <Sparkles className="h-12 w-12 text-white mb-6" strokeWidth={1} />
                                            <p className="text-sm font-medium tracking-widest uppercase text-slate-400">Ready to Generate</p>
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
