'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 text-center sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white p-8 shadow-soft sm:w-full sm:max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                    Something went wrong
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    We encountered an unexpected error. Our team has been notified.
                    Please try again or contact support if the issue persists.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <button
                        onClick={reset}
                        className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-gray-400">
                <p>Error ID: {error.digest || 'Unknown'}</p>
            </div>
        </div>
    );
}
