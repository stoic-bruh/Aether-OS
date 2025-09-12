// in app/api/resources/[id]/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

/**
 * PATCH: Updates a specific resource (e.g., changes its title or URL).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json(); // e.g., { title: "New title" }

    const { data, error } = await supabase
      .from("resources")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error updating resource:", error.message);
    return NextResponse.json({ error: "Failed to update resource." }, { status: 500 });
  }
}

/**
 * DELETE: Deletes a specific resource.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting resource:", error.message);
    return NextResponse.json({ error: "Failed to delete resource." }, { status: 500 });
  }
}