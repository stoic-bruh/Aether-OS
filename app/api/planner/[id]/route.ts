import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

/**
 * PATCH: Updates a specific planned event (e.g., changes its title).
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 note Promise
) {
  try {
    const { id } = await context.params; // 👈 await
    const body = await request.json(); // e.g., { title: "New title" }

    const { data, error } = await supabase
      .from("planned_events")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating planned event:", error.message);
    return NextResponse.json(
      { error: "Failed to update event." },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Deletes a specific planned event.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 note Promise
) {
  try {
    const { id } = await context.params; // 👈 await
    const { error } = await supabase
      .from("planned_events")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting planned event:", error.message);
    return NextResponse.json(
      { error: "Failed to delete event." },
      { status: 500 }
    );
  }
}
