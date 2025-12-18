import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                <div className="prose prose-indigo text-gray-600">
                    <p>Effective Date: {new Date().toLocaleDateString()}</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using PropText.ai, you agree to be bound by these Terms of Service.
                    </p>

                    <h3>2. Description of Service</h3>
                    <p>
                        PropText.ai provides AI-powered property description generation services for real estate professionals.
                    </p>

                    <h3>3. Usage & Credits</h3>
                    <p>
                        Free accounts are limited to a specific number of credits. Paid subscriptions offer unlimited generation. We reserve the right to limit usage to prevent abuse.
                    </p>

                    <h3>4. Intellectual Property</h3>
                    <p>
                        You own the rights to the descriptions you generate. PropText.ai retains rights to the underlying software and improved AI models.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        PropText.ai is provided &quot;as is&quot;. We are not liable for any damages arising from the use of our service.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
