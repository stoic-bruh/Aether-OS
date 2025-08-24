// in app/api/journal/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content, mood } = await request.json();
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!content) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .insert([{ content, mood, user_id: placeholderUserId }])
    .select();

  if (error) {
    console.error("Error inserting journal entry:", error);
    return NextResponse.json({ error: "Failed to create entry." }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}