import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile for credits
    const { data: profile } = await supabase
        .from("profiles")
        .select("credits_left")
        .eq("id", user.id)
        .single();

    const credits = profile?.credits_left ?? 0;

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            PropText<span className="text-indigo-600">.ai</span>
                        </span>
                    </Link>

                    <div className="mb-8 rounded-xl bg-indigo-50 p-4">
                        <h3 className="text-sm font-medium text-indigo-900">Credits Remaining</h3>
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-indigo-600">{credits}</span>
                            <span className="text-sm text-indigo-600">credits</span>
                        </div>
                        <Link
                            href="/dashboard/billing"
                            className="mt-3 block w-full rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                        >
                            Buy More
                        </Link>
                    </div>

                    <nav className="space-y-1">
                        <Link
                            href="/dashboard"
                            className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                            <PlusCircle className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                            New Generation
                        </Link>
                        <Link
                            href="/dashboard/history"
                            className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                            <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                            History
                        </Link>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                            >
                                <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                                Sign out
                            </button>
                        </form>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
