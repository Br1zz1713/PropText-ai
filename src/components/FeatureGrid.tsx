import { Zap, Search, Globe, Shield } from "lucide-react";

export const FeatureGrid = () => {
    const features = [
        {
            icon: Zap,
            title: "Instant Generation",
            description: "From inputs to polished copy in under 3 seconds. No more writer's block.",
        },
        {
            icon: Search,
            title: "SEO Optimized",
            description: "Automatically includes high-value keywords to rank your listings higher on Zillow and Redfin.",
        },
        {
            icon: Globe,
            title: "Multi-Language",
            description: "Generate native-quality descriptions in English, Spanish, French, and German instantly.",
        },
        {
            icon: Shield,
            title: "Fair Housing Compliant",
            description: "Our AI is trained to avoid biased language, keeping your listings safe and professional.",
        },
    ];

    return (
        <section className="py-24 lg:py-32 relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-6 max-w-2xl">
                        Designed for the modern <br />
                        real estate workflow.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {features.map((feature, index) => (
                        <div key={index} className="group">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
