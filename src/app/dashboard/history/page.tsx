import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Copy, FileText } from "lucide-react";
import HistoryActions from "./HistoryActions"; // Client component for interactivity

export default async function HistoryPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: generations } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">History</h1>
                <p className="text-muted-foreground">View and manage your previous generations.</p>
            </div>

            <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
                {generations && generations.length > 0 ? (
                    <ul className="divide-y divide-border">
                        {generations.map((gen) => (
                            <li key={gen.id} className="p-6 hover:bg-secondary/50 transition-colors">
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                                {gen.input_data.propertyType}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-foreground line-clamp-2">
                                            {gen.input_data.location} - {gen.input_data.bedrooms} Bed, {gen.input_data.bathrooms} Bath
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                            {gen.output_text}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        {/* We can use a client component for copy/delete to avoid hydration mismatch/router refresh issues easily */}
                                        <HistoryActions
                                            id={gen.id}
                                            text={gen.output_text}
                                            type={gen.input_data.propertyType}
                                            title={`${gen.input_data.propertyType} in ${gen.input_data.location}`}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-12 text-center text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No history yet</h3>
                        <p className="mt-1">Generate your first property description to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
