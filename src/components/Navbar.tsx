import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import NavbarCredits from "./NavbarCredits";

export async function Navbar() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary/90">
                            PropText<span className="text-primary">.ai</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            How it works
                        </Link>
                        <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                                >
                                    Dashboard
                                </Link>
                                <NavbarCredits />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                                >
                                    <span className="hidden sm:inline">Get Started</span>
                                    <span className="sm:hidden">Start</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
