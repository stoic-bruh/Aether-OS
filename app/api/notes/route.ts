import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET a single note by ID
export async function GET(req: NextRequest, context: any) {
  const id = context.params?.id;

  const { data, error } = await supabase
    .from("quick_notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE a note by ID
export async function DELETE(req: NextRequest, context: any) {
  const id = context.params?.id;

  const { error } = await supabase.from("quick_notes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }

  return NextResponse.json({ message: "Note deleted successfully" });
}

// UPDATE a note by ID
export async function PUT(req: NextRequest, context: any) {
  const id = context.params?.id;
  const body = await req.json();

  const { error } = await supabase.from("quick_notes").update(body).eq("id", id);

  if (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }

  return NextResponse.json({ message: "Note updated successfully" });
}
