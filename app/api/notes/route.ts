import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content } = await request.json();
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("quick_notes")
    .insert([{ content: content, user_id: placeholderUserId }]);

  if (error) {
    console.error("Error inserting note:", error);
    return NextResponse.json({ error: "Failed to save note." }, { status: 500 });
  }

  return NextResponse.json({ message: "Note saved successfully!", data: data }, { status: 201 });
}
