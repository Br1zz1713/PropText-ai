import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="col-span-1">
                        <span className="text-base font-bold tracking-tight text-slate-900">
                            PropText<span className="text-indigo-600">.ai</span>
                        </span>
                        <p className="mt-3 text-sm text-slate-500 max-w-xs">
                            AI-powered property descriptions for real estate professionals.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Product</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <Link href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-sm text-slate-500 hover:text-slate-900">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t border-slate-200 pt-6">
                    <p className="text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} PropText.ai. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
