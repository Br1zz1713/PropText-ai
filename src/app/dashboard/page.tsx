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
        <div className="max-w-6xl mx-auto py-6 min-h-[calc(100vh-80px)] flex flex-col justify-center">
            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:text-white dark:from-white dark:to-slate-400">
                    New Property Listing
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Enter the details below to generate a premium description.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-7 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section: Basic Info */}
                        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-md dark:hover:shadow-indigo-500/10">
                            <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-indigo-600 font-bold mb-6 dark:text-indigo-400">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div> Property Details
                            </h3>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1 dark:text-slate-400">Type</label>
                                    <div className="relative">
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white dark:bg-slate-800/50 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800 dark:focus:ring-indigo-500"
                                        >
                                            <option>Apartment</option>
                                            <option>House</option>
                                            <option>Villa</option>
                                            <option>Penthouse</option>
                                            <option>Studio</option>
                                            <option>Commercial</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1 dark:text-slate-400">Size (m²)</label>
                                    <input
                                        type="number"
                                        name="sqMeters"
                                        required
                                        value={formData.sqMeters}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white dark:bg-slate-800/50 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800 dark:placeholder:text-slate-600 dark:focus:ring-indigo-500"
                                        placeholder="85"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1 dark:text-slate-400">Bedrooms</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white dark:bg-slate-800/50 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800 dark:placeholder:text-slate-600 dark:focus:ring-indigo-500"
                                        placeholder="2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1 dark:text-slate-400">Bathrooms</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white dark:bg-slate-800/50 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800 dark:placeholder:text-slate-600 dark:focus:ring-indigo-500"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Location & Features */}
                        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-md">
                            <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-indigo-600 font-bold mb-6">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div> Location & Features
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white"
                                        placeholder="e.g. Berlin, Mitte"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Amenities</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        value={formData.amenities}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white"
                                        placeholder="Balcony, Floor heating, Smart Home..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Unique Selling Point</label>
                                    <textarea
                                        name="usp"
                                        rows={2}
                                        value={formData.usp}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white resize-none"
                                        placeholder="e.g. Stunning rooftop terrace with city views"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Style */}
                        <div className="glass-card rounded-2xl p-6 transition-all hover:shadow-md">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Tone</label>
                                    <select
                                        name="style"
                                        value={formData.style}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white"
                                    >
                                        <option>Professional</option>
                                        <option>Luxury</option>
                                        <option>Warm & Cozy</option>
                                        <option>Modern</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-0 bg-slate-50/50 p-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all hover:bg-white"
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
                            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:scale-[1.01] hover:shadow-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Crafting Description...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                    Generate Listing
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Output Section */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <div className="glass-panel min-h-[600px] rounded-3xl p-1 shadow-2xl shadow-indigo-500/10 flex flex-col relative overflow-hidden ring-1 ring-white/60">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>

                            <div className="relative z-10 flex-1 bg-white/40 backdrop-blur-sm rounded-2xl m-1 flex flex-col border border-white/50">
                                <div className="flex justify-between items-center p-6 border-b border-white/20">
                                    <h3 className="text-sm uppercase tracking-wider text-slate-900 font-bold flex items-center gap-2">
                                        <Sparkles size={16} className="text-indigo-500" />
                                        AI Result
                                    </h3>
                                    {result && (
                                        <button
                                            onClick={copyToClipboard}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all",
                                                copied
                                                    ? "bg-green-50 border-green-200 text-green-700"
                                                    : "bg-white border-white/60 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 shadow-sm"
                                            )}
                                        >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                                    {loading ? (
                                        <div className="space-y-4 animate-pulse">
                                            <div className="h-4 bg-indigo-100/50 rounded w-3/4"></div>
                                            <div className="h-4 bg-indigo-100/50 rounded w-full"></div>
                                            <div className="h-4 bg-indigo-100/50 rounded w-5/6"></div>
                                            <div className="h-4 bg-indigo-100/50 rounded w-full"></div>
                                            <div className="space-y-2 pt-4">
                                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                                <div className="h-3 bg-slate-100 rounded w-11/12"></div>
                                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                            </div>
                                        </div>
                                    ) : result ? (
                                        <div className="animate-in fade-in zoom-in-95 duration-500">
                                            <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                                                {result}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
                                            <div className="p-4 rounded-full bg-slate-50 ring-1 ring-slate-100">
                                                <Sparkles className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-medium">Ready to create magic</p>
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
