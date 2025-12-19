import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Ultra-Subtle Gradient Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Compact Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 mb-8 border border-primary/20 transition-transform hover:scale-105">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">
                            Powered by AI
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground mb-6">
                        Property descriptions that{" "}
                        <span className="text-primary relative">
                            sell faster
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 blur-sm rounded-full"></span>
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                        Generate professional, SEO-optimized real estate descriptions in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                        >
                            Start Free
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="inline-flex items-center justify-center rounded-xl border border-border bg-background/50 px-8 py-4 text-base font-medium text-foreground shadow-sm transition-all hover:bg-secondary/50 hover:border-border/80"
                        >
                            See How It Works
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
