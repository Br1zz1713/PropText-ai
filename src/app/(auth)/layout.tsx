import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <Link
                href="/"
                className="absolute left-4 top-4 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 md:left-8 md:top-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            PropText<span className="text-indigo-600">.ai</span>
                        </span>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
