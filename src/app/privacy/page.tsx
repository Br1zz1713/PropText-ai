import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 py-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <div className="flex justify-center mb-8">
                            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Shield className="h-8 w-8" />
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
                            Privacy Policy
                        </h1>
                        <p className="text-center text-gray-500 mb-12">
                            Effective Date: December 18, 2025
                        </p>

                        <div className="prose prose-lg prose-indigo mx-auto text-gray-600 prose-headings:font-semibold prose-headings:text-gray-900 prose-ul:list-disc prose-li:marker:text-indigo-400">
                            <h3>1. Introduction</h3>
                            <p>
                                PropText.ai (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered real estate description generator.
                            </p>

                            <h3>2. Data We Collect</h3>
                            <ul className="space-y-2">
                                <li><strong className="text-gray-900">Account Information:</strong> Email address and authentication data provided via Supabase Auth.</li>
                                <li><strong className="text-gray-900">Usage Data:</strong> Details about the property parameters you input into our generator.</li>
                                <li><strong className="text-gray-900">Payment Data:</strong> Transaction processing is handled securely by Stripe. We do not store your full credit card details on our servers.</li>
                                <li><strong className="text-gray-900">AI Interactions:</strong> Text inputs processed by Google Gemini API to generate your descriptions.</li>
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
                                <li><strong className="text-gray-900">Supabase:</strong> For database and authentication services in the EU region.</li>
                                <li><strong className="text-gray-900">Google Cloud (Gemini API):</strong> For processing AI requests. Your data is not used by Google to train their public models.</li>
                                <li><strong className="text-gray-900">Stripe:</strong> For secure payment processing.</li>
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
                                For any questions regarding this policy, please contact us at: <a href="mailto:eugeneberezanskyi@gmail.com" className="text-indigo-600 hover:text-indigo-700 font-medium">eugeneberezanskyi@gmail.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
