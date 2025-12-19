import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

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

    const { data: profile } = await supabase
        .from("profiles")
        .select("credits_left")
        .eq("id", user.id)
        .single();

    const credits = profile?.credits_left ?? 0;

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <DashboardSidebar credits={credits} />

            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
