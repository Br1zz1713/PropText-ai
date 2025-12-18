"use client";

import { useState } from "react";
import { Loader2, Sparkles, Copy, Check, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GeneratorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

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
            toast.success("Copied to clipboard");
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Property Listing</h1>
                <p className="mt-2 text-slate-500">Enter the details below to generate a premium description.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-3xl shadow-card p-8 border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Section: Basic Info */}
                            <div className="pb-6 border-b border-slate-100">
                                <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">Property Details</h3>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Type</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                        >
                                            <option>Apartment</option>
                                            <option>House</option>
                                            <option>Villa</option>
                                            <option>Studio</option>
                                            <option>Penthouse</option>
                                            <option>Commercial Space</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Size (m²)</label>
                                        <input
                                            type="number"
                                            name="sqMeters"
                                            required
                                            value={formData.sqMeters}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                            placeholder="85"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms</label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            required
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                            placeholder="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms</label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            required
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Location & Features */}
                            <div className="pb-6 border-b border-slate-100 space-y-5">
                                <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">Location & Features</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                        placeholder="e.g. Barcelona, Eixample"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Key Amenities</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        value={formData.amenities}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                        placeholder="Balcony, Parking, Smart Home System..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                        Unique Selling Point <Info className="h-4 w-4 text-slate-400" />
                                    </label>
                                    <textarea
                                        name="usp"
                                        rows={2}
                                        value={formData.usp}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow resize-none"
                                        placeholder="e.g. Panoramic sea views, Designer kitchen"
                                    />
                                </div>
                            </div>

                            {/* Section: Style */}
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Tone</label>
                                    <select
                                        name="style"
                                        value={formData.style}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                    >
                                        <option>Professional</option>
                                        <option>Luxury</option>
                                        <option>Cozy & Warm</option>
                                        <option>Modern</option>
                                        <option>Investment Focused</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                                    >
                                        <option>English</option>
                                        <option>German</option>
                                        <option>French</option>
                                        <option>Spanish</option>
                                        <option>Romanian</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-glow transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Crafting Description...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Generate Listing
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Output Section */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <div className="bg-white rounded-3xl shadow-card p-6 border border-slate-100 min-h-[500px] flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                                <h3 className="text-sm uppercase tracking-wider text-slate-900 font-bold">Generated Result</h3>
                                {result && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy Text
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                                        <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-indigo-600 animate-pulse" />
                                    </div>
                                    <p className="font-medium animate-pulse text-sm">Analyzing property details...</p>
                                </div>
                            ) : result ? (
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {result}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                                    <Sparkles className="h-10 w-10 mb-3 opacity-50" />
                                    <p className="text-sm font-medium">Ready to generate</p>
                                    <p className="text-xs mt-1 max-w-[200px] text-center">Fill out the form to create a professional listing.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
