import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative overflow-hidden pt-36 pb-24 lg:pt-48 lg:pb-32">
            {/* Background: Ghostly Gradient Mesh (Deep Blue/Purple) */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300/40 via-background to-background dark:from-indigo-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full opacity-70 pointer-events-none dark:bg-primary/20 dark:opacity-50" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

                    {/* Badge: "New" or "AI Powered" - Minimalist */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-50/50 px-3 py-1.5 mb-8 backdrop-blur-md transition-all hover:bg-slate-100/50 hover:border-slate-300/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            PropText AI 2.0
                        </span>
                    </div>

                    {/* Headline: Apple-Style, Tracking Tighter, High Contrast */}
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/70 mb-8 leading-[1.1]">
                        Property descriptions <br className="hidden md:block" />
                        that <span className="text-indigo-600 dark:text-white">sell themselves.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light tracking-tight">
                        Generate professional, SEO-optimized real estate listings in seconds.
                        The tool top realtors use to close faster.
                    </p>

                    {/* CTA Buttons - Glowing, High Saturation */}
                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <Link
                            href="/signup"
                            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10">Start Generating Free</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            <div className="absolute inset-0 rounded-full ring-4 ring-white/10 group-hover:ring-white/20 transition-all" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/50 px-8 py-4 text-base font-medium text-gray-900 shadow-sm backdrop-blur-sm transition-all hover:bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/20"
                        >
                            View Interactive Demo
                        </Link>
                    </div>

                    {/* Linear-Inspired Demo Visual (Placeholder for 3D/Glass Element) */}
                    <div className="relative w-full max-w-6xl -mb-32 lg:-mb-48 perspective-[2000px]">
                        <div className="relative rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl rotate-x-12 transform-gpu transition-all duration-1000 hover:rotate-x-0 group overflow-hidden">
                            {/* Mock UI Header */}
                            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-white/5">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/20" />
                                </div>
                                <div className="h-2 w-32 rounded-full bg-white/10" />
                            </div>
                            {/* Mock UI Content */}
                            <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="h-3 w-16 rounded bg-indigo-500/50" />
                                        <div className="h-8 w-full rounded-lg bg-white/5 border border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 rounded bg-purple-500/50" />
                                        <div className="h-24 w-full rounded-lg bg-white/5 border border-white/10" />
                                    </div>
                                    <div className="h-10 w-32 rounded-lg bg-primary mt-4" />
                                </div>
                                <div className="relative rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 p-6 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Sparkles className="h-5 w-5 text-indigo-400" />
                                        <span className="text-sm font-semibold text-indigo-300">AI Generated Output</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full rounded bg-white/20" />
                                        <div className="h-2 w-5/6 rounded bg-white/20" />
                                        <div className="h-2 w-full rounded bg-white/20" />
                                        <div className="h-2 w-4/6 rounded bg-white/20" />
                                    </div>
                                </div>
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
