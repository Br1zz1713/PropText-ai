"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { getSiteUrl } from "@/lib/utils";

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const errorMsg = searchParams.get("error_description") || searchParams.get("error");
        if (errorMsg) {
            let message = decodeURIComponent(errorMsg);
            if (message.includes("access_denied")) {
                message = "Access denied. You may have cancelled the Google sign-in process.";
            }
            setError(message);
        }

        // Check if user is already logged in
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.replace("/dashboard");
            }
        };
        checkSession();
    }, [searchParams, router, supabase.auth]);

    const handleResend = async () => {
        if (!email) {
            setError("Please enter your email address to resend the confirmation.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${getSiteUrl()}/auth/callback`
            }
        });
        setLoading(false);
        if (error) setError(error.message);
        else setError("Confirmation email resent! Check your inbox.");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.refresh();
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google") => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${getSiteUrl()}/auth/callback`,
            },
        });
        if (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft">
            <h2 className="text-center text-xl font-semibold text-gray-900">
                Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
                Sign in to generate more descriptions
            </p>

            <div className="mt-8 space-y-4">
                <button
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Sign in with Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <p>{error}</p>
                                    {(error.toLowerCase().includes("expired") || error.toLowerCase().includes("invalid") || error.toLowerCase().includes("token")) && (
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            className="text-left font-semibold underline hover:text-red-800"
                                        >
                                            Resend confirmation email
                                        </button>
                                    )}
                                </div>
                            </div>
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
                        Sign in
                    </button>
                </form>
            </div>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Don&apos;t have an account? </span>
                <Link
                    href="/signup"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
