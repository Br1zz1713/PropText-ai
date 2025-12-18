"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft text-center">
                <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
                <p className="mt-4 text-gray-500">
                    We&apos;ve sent you a confirmation link to <strong>{email}</strong>.
                </p>
                <div className="mt-8">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
                Start generating property descriptions in seconds
            </p>

            <form onSubmit={handleSignup} className="mt-8 space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Create a password"
                    />
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link
                    href="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                    Log in
                </Link>
            </div>
        </div>
    );
}
