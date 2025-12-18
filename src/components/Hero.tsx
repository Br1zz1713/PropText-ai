import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden">
            {/* Gradient Mesh Background */}
            <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 mb-8 border border-indigo-100">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            Powered by Google Gemini 1.5
                        </span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                        Listing descriptions that <br />
                        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            sell properties faster.
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
                        Generate professional, SEO-optimized real estate descriptions in seconds.
                        Tailored for the European market.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-glow transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                        >
                            Start Generating Free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 shadow-soft transition-all hover:bg-slate-50 hover:border-slate-300"
                        >
                            View Examples
                        </Link>
                    </div>

                    {/* Abstract UI Preview */}
                    <div className="mt-20 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-sm p-4 shadow-card">
                        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden aspect-[16/9] relative">
                            {/* Mock UI Content */}
                            <div className="absolute inset-x-0 top-0 h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                                <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
                            </div>
                            <div className="p-12 flex items-center justify-center h-full text-slate-300">
                                <span className="text-lg font-medium">Interactive Demo Interface</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
