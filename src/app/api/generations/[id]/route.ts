import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient();
    const id = params.id;

    const { error } = await supabase
        .from("generations")
        .delete()
        .eq("id", id); // RLS policies will automatically check user ownership

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
