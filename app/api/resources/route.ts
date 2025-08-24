// in app/api/resources/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, url, type, subject } = await request.json();
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("resources")
    .insert([{ title, url, type, subject, user_id: placeholderUserId }])
    .select();

  if (error) {
    console.error("Error inserting resource:", error);
    return NextResponse.json({ error: "Failed to create resource." }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}