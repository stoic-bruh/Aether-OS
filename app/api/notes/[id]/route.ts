import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// To DELETE a note
export async function DELETE(
  request: Request,
  context: { params: { id: string } } // This is the corrected part
) {
  const id = context.params.id; // We now get the id from the context object

  const { error } = await supabase.from("quick_notes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }

  return NextResponse.json({ message: "Note deleted successfully" });
}
