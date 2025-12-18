import { FileText, Settings, Sparkles } from "lucide-react";

const steps = [
    {
        icon: Settings,
        title: "1. Input Details",
        description: "Enter property specifics like dimensions, location, and key amenities.",
    },
    {
        icon: Sparkles,
        title: "2. Choose Style",
        description: "Select from Luxury, Professional, Cozy, or other listing styles.",
    },
    {
        icon: FileText,
        title: "3. Generate & Edit",
        description: "Get a perfect AI-written description in seconds. Edit if needed.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-50 relative">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white blur-3xl opacity-60 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        How PropText.ai Works
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Three simple steps to professional listings.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/50 border border-slate-100 hover:bg-white hover:shadow-soft transition-all duration-300">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 text-primary mb-6">
                                <step.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
