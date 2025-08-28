import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

// GET a single note by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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

// UPDATE a note by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { error } = await supabase
    .from("quick_notes")
    .update(body)
    .eq("id", id);

  if (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }

  return NextResponse.json({ message: "Note updated successfully" });
}

// DELETE a note by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from("quick_notes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }

  return NextResponse.json({ message: "Note deleted successfully" });
}