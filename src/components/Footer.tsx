import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-lg font-bold tracking-tight text-gray-900">
                            PropText<span className="text-indigo-600">.ai</span>
                        </span>
                        <p className="mt-4 text-sm text-gray-500">
                            Professional AI property descriptions for European real estate agents.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Product</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="#features" className="text-sm text-gray-500 hover:text-gray-900">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-sm text-gray-500 hover:text-gray-900">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} PropText.ai. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
