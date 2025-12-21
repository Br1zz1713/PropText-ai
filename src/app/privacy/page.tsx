import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-32 pb-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex flex-col items-center mb-12">
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                            <Shield className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-center text-slate-400">
                            Effective Date: December 18, 2025
                        </p>
                    </div>

                    <div className="prose prose-lg prose-invert mx-auto text-slate-400 prose-headings:font-semibold prose-headings:text-white prose-strong:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/90">
                        <h3>1. Introduction</h3>
                        <p>
                            PropText.ai (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered real estate description generator.
                        </p>

                        <h3>2. Data We Collect</h3>
                        <ul className="space-y-2">
                            <li><strong>Account Information:</strong> Email address and authentication data provided via Supabase Auth.</li>
                            <li><strong>Usage Data:</strong> Details about the property parameters you input into our generator.</li>
                            <li><strong>Payment Data:</strong> Transaction processing is handled securely by Stripe. We do not store your full credit card details on our servers.</li>
                            <li><strong>AI Interactions:</strong> Text inputs processed by Google Gemini API to generate your descriptions.</li>
                        </ul>

                        <h3>3. How We Use Your Data</h3>
                        <ul className="space-y-2">
                            <li>To provide and maintain our service.</li>
                            <li>To manage your user account and credits.</li>
                            <li>To process payments via Stripe.</li>
                            <li>To comply with legal obligations under the GDPR (General Data Protection Regulation).</li>
                        </ul>

                        <h3>4. Data Sharing and Third Parties</h3>
                        <p>We share data with the following essential service providers:</p>
                        <ul className="space-y-2">
                            <li><strong>Supabase:</strong> For database and authentication services in the EU region.</li>
                            <li><strong>Google Cloud (Gemini API):</strong> For processing AI requests. Your data is not used by Google to train their public models.</li>
                            <li><strong>Stripe:</strong> For secure payment processing.</li>
                        </ul>

                        <h3>5. Your Rights (GDPR)</h3>
                        <p>Under EU law, you have the right to:</p>
                        <ul className="space-y-2">
                            <li>Access your personal data.</li>
                            <li>Correct inaccurate data.</li>
                            <li>Request the deletion of your data (&quot;Right to be forgotten&quot;).</li>
                            <li>Object to data processing.</li>
                        </ul>

                        <h3>6. Cookies</h3>
                        <p>
                            We use essential cookies to keep you logged in and to remember your preferences. You can manage cookie settings through your browser.
                        </p>

                        <h3>7. Contact Us</h3>
                        <p>
                            For any questions regarding this policy, please contact us at: <a href="mailto:eugeneberezanskyi@gmail.com">eugeneberezanskyi@gmail.com</a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
