import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/30 via-white to-white" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

                    {/* Compact Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 mb-6 border border-indigo-100">
                        <Sparkles className="h-3 w-3 text-indigo-600" />
                        <span className="text-xs font-medium text-indigo-700">
                            Powered by AI
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                        Property descriptions that{" "}
                        <span className="text-indigo-600">
                            sell faster
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-slate-600 max-w-xl">
                        Generate professional, SEO-optimized real estate descriptions in seconds.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
                        >
                            Start Free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                        >
                            See How It Works
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
