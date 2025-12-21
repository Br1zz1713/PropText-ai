import { createClient } from "@/utils/supabase/server";
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

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("credits_remaining")
            .eq("id", user.id)
            .maybeSingle();

        if (!profile) {
            // Auto-create profile if missing (safety check)
            const { error: insertError } = await supabase.from("profiles").insert({
                id: user.id,
                email: user.email,
                credits_remaining: 3,
                subscription_status: "free",
            });

            if (insertError) {
                console.error("Error creating profile:", insertError);
            }
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out selection:bg-primary/30">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Global Grid Texture for Dashboard */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] pointer-events-none" />

                <DashboardHeader />
                <main className="flex-1 p-6 lg:p-8 relative z-10 overflow-y-auto">
                    <div className="mx-auto max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
