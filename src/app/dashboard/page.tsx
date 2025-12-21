"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Copy, Check, Home, MapPin, Edit3 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useCredits } from "@/components/CreditsProvider";

export default function GeneratorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { refreshCredits } = useCredits();

    const supabase = createClient();

    const [credits, setCredits] = useState<number | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from("profiles").select("credits_remaining").eq("id", user.id).single();
                if (profile) setCredits(profile.credits_remaining ?? 0);
            }

            if (searchParams.get("welcome")) {
                const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest";
                toast.success(`Welcome back, ${name}`);
                router.replace("/dashboard");
            }
        };
        init();
    }, [searchParams, router, supabase]);

    const [formData, setFormData] = useState({
        propertyType: "Apartment",
        sqm: "",
        livingArea: "", // New
        kitchenArea: "", // New
        bedrooms: "",
        bathrooms: "",
        floor: "", // New
        totalFloors: "", // New
        ceilingHeight: "", // New
        yearBuilt: "", // New
        wallMaterial: "Brick", // New
        balcony: "None", // New
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
                throw new Error(data.error || `Error ${res.status}: ${data.message || "Something went wrong"}`);
            }

            setResult(data.description);
            router.refresh();
            refreshCredits();
            toast.success("Description generated successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const title = `${formData.propertyType} in ${formData.location}`;

            console.log("Attempting to save listing:", { user_id: user.id, title, ...formData });

            const { error } = await supabase.from("listings").insert({
                user_id: user.id,
                title: title,
                description: result,
                property_type: formData.propertyType,
                location: formData.location,
                property_details: {
                    sqm: formData.sqm,
                    livingArea: formData.livingArea,
                    kitchenArea: formData.kitchenArea,
                    bedrooms: formData.bedrooms,
                    bathrooms: formData.bathrooms,
                    floor: formData.floor,
                    totalFloors: formData.totalFloors,
                    ceilingHeight: formData.ceilingHeight,
                    yearBuilt: formData.yearBuilt,
                    wallMaterial: formData.wallMaterial,
                    balcony: formData.balcony,
                    amenities: formData.amenities,
                    style: formData.style,
                    language: formData.language
                }
            });

            if (error) throw error;

            toast.success("Saved to My Listings!");
            router.refresh();
        } catch (error: any) {
            console.error("Save Error:", error);
            toast.error(`Save Failed: ${error.message}`);
        } finally {
            setSaving(false);
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
        <div className="min-h-screen pb-20 pt-8 sm:pt-12 bg-background text-foreground transition-colors">
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
                            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                                        <Home size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Essentials</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="col-span-full sm:col-span-1">
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Property Type</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            <option className="bg-background text-foreground">Apartment</option>
                                            <option className="bg-background text-foreground">House</option>
                                            <option className="bg-background text-foreground">Villa</option>
                                            <option className="bg-background text-foreground">Penthouse</option>
                                            <option className="bg-background text-foreground">Commercial Space</option>
                                        </select>
                                    </div>

                                    {/* Areas */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Total Size (m²)</label>
                                        <input
                                            type="number"
                                            name="sqm"
                                            value={formData.sqm}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Living (m²)</label>
                                        <input
                                            type="number"
                                            name="livingArea"
                                            value={formData.livingArea}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="80"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Kitchen (m²)</label>
                                        <input
                                            type="number"
                                            name="kitchenArea"
                                            value={formData.kitchenArea}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="15"
                                        />
                                    </div>

                                    {/* Rooms */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Bedrooms</label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Bathrooms</label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="1"
                                        />
                                    </div>

                                    {/* Tech Specs */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Floor</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="floor"
                                                value={formData.floor}
                                                onChange={handleChange}
                                                className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                                placeholder="5"
                                            />
                                            <span className="text-muted-foreground">/</span>
                                            <input
                                                type="number"
                                                name="totalFloors"
                                                value={formData.totalFloors}
                                                onChange={handleChange}
                                                className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                                placeholder="10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Ceiling (m)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="ceilingHeight"
                                            value={formData.ceilingHeight}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="2.8"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Year Built</label>
                                        <input
                                            type="number"
                                            name="yearBuilt"
                                            value={formData.yearBuilt}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="2020"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Walls</label>
                                        <select
                                            name="wallMaterial"
                                            value={formData.wallMaterial}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            <option className="bg-background text-foreground">Brick</option>
                                            <option className="bg-background text-foreground">Concrete</option>
                                            <option className="bg-background text-foreground">Monolith</option>
                                            <option className="bg-background text-foreground">Panel</option>
                                            <option className="bg-background text-foreground">Block</option>
                                            <option className="bg-background text-foreground">Wood</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Balcony</label>
                                        <select
                                            name="balcony"
                                            value={formData.balcony}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            <option className="bg-background text-foreground">None</option>
                                            <option className="bg-background text-foreground">Balcony</option>
                                            <option className="bg-background text-foreground">Loggia</option>
                                            <option className="bg-background text-foreground">Terrace</option>
                                            <option className="bg-background text-foreground">Patio</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            {/* Card: Location & Features */}
                            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400">
                                        <MapPin size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Location</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Address</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="e.g. Downtown, New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Key Features</label>
                                        <textarea
                                            name="amenities"
                                            rows={3}
                                            value={formData.amenities}
                                            onChange={handleChange}
                                            className="w-full resize-none rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
                                            placeholder="Balcony, Concierge, Rooftop pool..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card: Tone Settings */}
                            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                        <Edit3 size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Style</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Tone</label>
                                        <select
                                            name="style"
                                            value={formData.style}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            <option className="bg-background text-foreground">Professional</option>
                                            <option className="bg-background text-foreground">Luxury</option>
                                            <option className="bg-background text-foreground">Warm</option>
                                            <option className="bg-background text-foreground">Modern</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Language</label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-background/50 border border-input px-4 py-3.5 text-sm font-medium text-foreground transition-all focus:bg-background focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            <option className="bg-background text-foreground">English</option>
                                            <option className="bg-background text-foreground">German</option>
                                            <option className="bg-background text-foreground">French</option>
                                            <option className="bg-background text-foreground">Spanish</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || credits === 0}
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-primary/25"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : credits === 0 ? (
                                    <span>No Credits Remaining</span>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        <span>Generate Description</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Preview (Span 5) */}
                    <div className="lg:col-span-5 sticky top-8">
                        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-xl p-8 shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden text-foreground">

                            {/* Actions Header */}
                            {result && (
                                <div className="flex items-center justify-between mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                        Editable Preview
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-all disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-all"
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            {loading ? (
                                <div className="space-y-6 animate-pulse relative">
                                    {/* Apple-Style Skeleton */}
                                    <div className="h-4 w-3/4 rounded-full bg-muted" />
                                    <div className="h-4 w-full rounded-full bg-muted" />
                                    <div className="h-4 w-5/6 rounded-full bg-muted" />
                                    <div className="h-4 w-full rounded-full bg-muted" />
                                    <div className="h-4 w-2/3 rounded-full bg-muted" />

                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted/20 to-transparent" />
                                </div>
                            ) : result ? (
                                <textarea
                                    value={result}
                                    onChange={(e) => setResult(e.target.value)}
                                    className="flex-1 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground/90 outline-none placeholder:text-muted-foreground font-sans tracking-tight h-full p-0 border-none focus:ring-0"
                                    placeholder="Generated text will appear here..."
                                />
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center text-center opacity-40">
                                    <Sparkles className="h-12 w-12 text-muted-foreground mb-6" strokeWidth={1} />
                                    <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
                                        Ready to Generate
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
