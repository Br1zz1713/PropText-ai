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
        <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    New Property Listing
                </h1>
                <p className="mt-2 text-muted-foreground">Generate a premium description in seconds.</p>
            </div>

            <div className="grid gap-10">
                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section: Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Property Details</h3>
                        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Type</label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Size (m²)</label>
                                <input
                                    type="number"
                                    name="sqMeters"
                                    required
                                    value={formData.sqMeters}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                    placeholder="e.g. 120"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Bedrooms</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                    placeholder="2"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Location & Features */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Features & Location</h3>
                        <div className="space-y-6 pb-6 border-b border-border">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Address / Area</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                    placeholder="e.g. Downtown, New York"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Key Amenities</label>
                                <input
                                    type="text"
                                    name="amenities"
                                    value={formData.amenities}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                    placeholder="Balcony, Concierge, Rooftop, Gym..."
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Unique Selling Point</label>
                                <textarea
                                    name="usp"
                                    rows={2}
                                    value={formData.usp}
                                    onChange={handleChange}
                                    className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                    placeholder="What makes this property special?"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Configuration */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Tone</label>
                                <select
                                    name="style"
                                    value={formData.style}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
                                >
                                    <option>Professional</option>
                                    <option>Luxury</option>
                                    <option>Warm & Cozy</option>
                                    <option>Modern</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-foreground">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring"
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
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Generate Description
                            </>
                        )}
                    </button>
                </form>

                {/* Result Section */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <Sparkles size={14} className="text-indigo-600" />
                            AI Result
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[200px]">
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 w-3/4 rounded bg-secondary"></div>
                                <div className="h-4 w-full rounded bg-secondary"></div>
                                <div className="h-4 w-5/6 rounded bg-secondary"></div>
                            </div>
                        ) : result ? (
                            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
                                <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                                    {result}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-2 text-center text-muted-foreground/60 py-10">
                                <Sparkles className="h-6 w-6" />
                                <p className="text-sm">Ready to generate</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
