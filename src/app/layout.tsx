import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "PropText.ai - Professional Real Estate Descriptions",
    description: "AI-powered property description generator for European Realtors.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.variable + " antialiased min-h-screen flex flex-col"}>
                {children}
                <CookieBanner />
                <Toaster position="bottom-center" richColors />
            </body>
        </html>
    );
}
