"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Copy, Check, Info } from "lucide-react";
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    New Property Listing
                </h1>
                <p className="mt-2 text-muted-foreground">Generate a premium description in seconds.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Input Form (Span 7) */}
                <div className="lg:col-span-7 space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section: Basic Info */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <span className="text-xs font-bold">1</span>
                                </div>
                                Property Details
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Property Type</label>
                                    <select
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    >
                                        <option>Apartment</option>
                                        <option>House</option>
                                        <option>Villa</option>
                                        <option>Penthouse</option>
                                        <option>Studio</option>
                                        <option>Commercial</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Size (m²)</label>
                                    <input
                                        type="number"
                                        name="sqMeters"
                                        required
                                        value={formData.sqMeters}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="e.g. 120"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Bedrooms</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Bathrooms</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Location & Features */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <span className="text-xs font-bold">2</span>
                                </div>
                                Location & Features
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Address / Area</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="e.g. Downtown, New York"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Key Amenities</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        value={formData.amenities}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="Balcony, Concierge, Rooftop, Gym..."
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Unique Selling Point</label>
                                    <textarea
                                        name="usp"
                                        rows={2}
                                        value={formData.usp}
                                        onChange={handleChange}
                                        className="w-full resize-none rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        placeholder="What makes this property special?"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Configuration */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Tone</label>
                                    <select
                                        name="style"
                                        value={formData.style}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    >
                                        <option>Professional</option>
                                        <option>Luxury</option>
                                        <option>Warm & Cozy</option>
                                        <option>Modern</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-4 py-3 text-foreground shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    Generate Description
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Column: Result (Span 5) - Sticky */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-24 space-y-4">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-premium min-h-[500px] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                                    <Sparkles size={16} className="text-indigo-600" />
                                    AI Result
                                </h3>

                                {result && (
                                    <button
                                        onClick={copyToClipboard}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all",
                                            copied
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                                : "border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8">
                                {loading ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 animate-pulse">
                                            <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30"></div>
                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">AI is writing your premium listing...</p>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
                                            <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
                                            <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
                                            <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
                                            <div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
                                            <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-500">
                                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap">
                                            {result}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground opacity-60">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900">
                                            <Sparkles className="h-8 w-8" />
                                        </div>
                                        <div className="max-w-xs">
                                            <p className="text-sm font-medium text-foreground">Ready to create magic</p>
                                            <p className="mt-1 text-xs">Fill in the property details and let our AI write the perfect listing.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
