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
        <div className="mx-auto max-w-7xl px-8 py-10">
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        New Property Listing
                    </h1>
                    <p className="mt-2 text-muted-foreground">Generate a premium description in seconds.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Column: Input Form (Span 7) */}
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section: Basic Info */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-premium">
                            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Property Details
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Property Type</label>
                                    <select
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Location & Features */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-premium">
                            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                Location & Features
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Address / Area</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                            placeholder="e.g. Downtown, New York"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Key Amenities</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        value={formData.amenities}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                                        className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                        placeholder="What makes this property special?"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Configuration */}
                        <div className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-premium">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">Tone</label>
                                    <select
                                        name="style"
                                        value={formData.style}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
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

                {/* Right Column: Result (Span 5) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-premium lg:min-h-[600px] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border p-6 bg-muted/20">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                                    <Sparkles size={16} className="text-primary" />
                                    AI Result
                                </h3>

                                {result && (
                                    <button
                                        onClick={copyToClipboard}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all",
                                            copied
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                                : "border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
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
                                    <div className="space-y-6 animate-pulse">
                                        <div className="h-4 w-3/4 rounded bg-muted"></div>
                                        <div className="h-4 w-full rounded bg-muted"></div>
                                        <div className="h-4 w-5/6 rounded bg-muted"></div>
                                        <div className="h-4 w-full rounded bg-muted"></div>
                                        <div className="h-4 w-2/3 rounded bg-muted"></div>
                                    </div>
                                ) : result ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-500">
                                        <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                                            {result}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-muted-foreground opacity-60">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                            <Sparkles className="h-8 w-8" />
                                        </div>
                                        <div className="max-w-xs">
                                            <p className="text-sm font-medium text-foreground">Ready to create magic</p>
                                            <p className="mt-1 text-xs">Fill in the property details and let our AI write the perfect description.</p>
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
