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
        <section id="how-it-works" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-3 text-base text-slate-600">
                        Three simple steps to professional listings
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                                <step.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
