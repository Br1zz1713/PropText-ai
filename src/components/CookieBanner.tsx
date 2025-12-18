"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem("cookieConsent", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                    We use cookies to improve your experience. By using our site, you agree to our{" "}
                    <Link href="/privacy" className="text-indigo-600 underline">
                        Privacy Policy
                    </Link>
                    .
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShow(false)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
