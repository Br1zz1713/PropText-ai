"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Copy, Check, Info, Home, MapPin, List, Edit3 } from "lucide-react";
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
        <div className="min-h-screen bg-background pb-20 pt-8 sm:pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-12 max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                        New Listing <span className="text-muted-foreground/40">/ Generator</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                        Create premium property descriptions in seconds with our AI engine.
                        Optimized for real estate platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Column: Input Form (Span 7) */}
                    <div className="lg:col-span-7 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Section: Basic Info */}
                            <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:border-border/50">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 ring-1 ring-inset ring-blue-500/20 dark:text-blue-400">
                                        <Home size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight text-foreground">Property Details</h3>
                                        <p className="text-sm text-muted-foreground">The essentials of your listing</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                        >
                                            <option>Apartment</option>
                                            <option>House</option>
                                            <option>Villa</option>
                                            <option>Penthouse</option>
                                            <option>Studio</option>
                                            <option>Commercial</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size (m²)</label>
                                        <input
                                            type="number"
                                            name="sqMeters"
                                            required
                                            value={formData.sqMeters}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                            placeholder="120"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bedrooms</label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                            placeholder="2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bathrooms</label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Location & Features */}
                            <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:border-border/50">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 ring-1 ring-inset ring-purple-500/20 dark:text-purple-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight text-foreground">Location & Features</h3>
                                        <p className="text-sm text-muted-foreground">Where and what makes it special</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address / Area</label>
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                            placeholder="e.g. Downtown, New York"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Amenities</label>
                                        <textarea
                                            name="amenities"
                                            rows={2}
                                            value={formData.amenities}
                                            onChange={handleChange}
                                            className="w-full resize-none rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                            placeholder="Balcony, Concierge, Rooftop pool, Smart home system..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unique Selling Point</label>
                                        <div className="relative">
                                            <textarea
                                                name="usp"
                                                rows={2}
                                                value={formData.usp}
                                                onChange={handleChange}
                                                className="w-full resize-none rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                                placeholder="e.g. Stunning sunset views over the park..."
                                            />
                                            <Sparkles className="absolute right-3 top-3 h-4 w-4 text-amber-500/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Configuration */}
                            <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md dark:border-border/50">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 ring-1 ring-inset ring-orange-500/20 dark:text-orange-400">
                                        <Edit3 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight text-foreground">Style & Tone</h3>
                                        <p className="text-sm text-muted-foreground">Customize the output language</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tone</label>
                                        <select
                                            name="style"
                                            value={formData.style}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
                                        >
                                            <option>Professional</option>
                                            <option>Luxury</option>
                                            <option>Warm & Cozy</option>
                                            <option>Modern</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</label>
                                        <select
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-border/50 bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 hover:bg-secondary/50 outline-none"
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
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] transition-transform duration-700 ease-in-out group-hover:translate-x-[200%]" />
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Crafting Description...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
                                        <span>Generate Description</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Result (Span 5) - Sticky */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-background/50 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-white/5">
                                {/* Glass/Glow Effects */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

                                {/* Header */}
                                <div className="relative flex items-center justify-between border-b border-border/40 bg-muted/20 p-5 backdrop-blur-md">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <Sparkles size={16} />
                                        </div>
                                        <h3 className="text-sm font-semibold tracking-tight text-foreground">Starting Draft</h3>
                                    </div>

                                    {result && (
                                        <button
                                            onClick={copyToClipboard}
                                            className={cn(
                                                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95",
                                                copied
                                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "border-border/50 bg-background/50 hover:bg-background hover:border-border text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            {copied ? "Copied" : "Copy Text"}
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="relative min-h-[500px] p-6 sm:p-8">
                                    {loading ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 animate-pulse">
                                                <div className="h-2 w-2 rounded-full bg-primary/50"></div>
                                                <p className="text-xs font-medium uppercase tracking-widest text-primary/70">Generating</p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="h-4 w-3/4 rounded-full bg-muted/50 animate-pulse"></div>
                                                <div className="h-4 w-full rounded-full bg-muted/50 animate-pulse delay-75"></div>
                                                <div className="h-4 w-5/6 rounded-full bg-muted/50 animate-pulse delay-150"></div>
                                                <div className="h-4 w-full rounded-full bg-muted/50 animate-pulse delay-200"></div>
                                                <div className="h-4 w-2/3 rounded-full bg-muted/50 animate-pulse delay-300"></div>
                                            </div>
                                        </div>
                                    ) : result ? (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans">
                                                {result}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground/60 py-20">
                                            <div className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 transition-all duration-500 hover:border-primary/50 hover:bg-primary/5">
                                                <Sparkles className="h-8 w-8 transition-transform group-hover:scale-110 group-hover:text-primary" />
                                            </div>
                                            <div className="max-w-xs space-y-1">
                                                <p className="text-base font-semibold text-foreground">Ready to Create</p>
                                                <p className="text-sm">Enter the property details on the left to generate your premium listing.</p>
                                            </div>
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
