"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export default function BillingPage() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout');
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Failed to start checkout");
            }
        } catch (e) {
            alert("Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Upgrade to Pro</h1>

            <div className="bg-white rounded-3xl border border-indigo-200 p-8 shadow-xl flex flex-col items-center text-center max-w-md mx-auto">
                <div className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700 mb-4">
                    Recommended
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pro Agent</h3>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">€19</span>
                    <span className="text-lg text-gray-500">/month</span>
                </div>

                <ul className="mt-8 space-y-4 text-left w-full">
                    <li className="flex gap-3">
                        <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Unlimited Property Descriptions</span>
                    </li>
                    <li className="flex gap-3">
                        <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>All Languages (EN, DE, FR, ES, RO)</span>
                    </li>
                    <li className="flex gap-3">
                        <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Priority Support</span>
                    </li>
                </ul>

                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="mt-8 w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-lg font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Subscribe Now"}
                </button>
            </div>
        </div>
    )
}
