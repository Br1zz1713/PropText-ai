import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight } from "lucide-react";

export async function Navbar() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="fixed top-0 z-50 w-full glass">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            PropText<span className="text-primary">.ai</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-foreground transition-colors">
                            How it works
                        </Link>
                        <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-white shadow-soft transition-all hover:bg-slate-800"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden md:block text-sm font-medium text-slate-600 hover:text-foreground transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-glow transition-all hover:bg-indigo-700 active:scale-95"
                                >
                                    Get Started <ArrowRight className="h-4 w-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
