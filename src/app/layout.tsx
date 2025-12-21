import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CreditsProvider } from "@/components/CreditsProvider";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "PropText.ai - Professional Real Estate Descriptions",
    description: "AI-powered property description generator for European Realtors.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let credits = 0; // Default to 0 instead of 3 if not logged in/no profile

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("credits_remaining")
            .eq("id", user.id)
            .maybeSingle();

        // If profile exists, use it. usage of 3 logic is for new users in callback/layout, 
        // but here we just read. If 0, it means 0.
        if (profile) {
            credits = profile.credits_remaining ?? 0;
        }
    }
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.variable + " antialiased min-h-screen flex flex-col"}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    forcedTheme="dark"
                    disableTransitionOnChange
                >
                    <CreditsProvider initialCredits={credits}>
                        {children}
                    </CreditsProvider>
                    <CookieBanner />
                    <Toaster position="bottom-center" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
