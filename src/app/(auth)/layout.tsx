import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

            <Link
                href="/"
                className="absolute left-4 top-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all md:left-8 md:top-8"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                            PropText<span className="text-primary">.ai</span>
                        </span>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
