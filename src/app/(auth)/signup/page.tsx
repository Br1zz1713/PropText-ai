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
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl dark:border-border/50">
            <h2 className="text-center text-xl font-bold tracking-tight text-foreground">
                Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
                Start generating property descriptions in seconds
            </p>

            <form onSubmit={handleSignup} className="mt-8 space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-xl border border-input bg-secondary/30 px-4 py-2.5 text-foreground shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-xl border border-input bg-secondary/30 px-4 py-2.5 text-foreground shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                        placeholder="Create a password"
                    />
                </div>

                {error && (
                    <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                </button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link
                    href="/login"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                    Log in
                </Link>
            </div>
        </div>
    );
}
