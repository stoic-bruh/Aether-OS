// in app/api/tasks/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// GET function remains the same

export async function POST(request: Request) {
  // Add due_date to the destructured object
  const { title, subject, priority, due_date } = await request.json(); 
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    // Add due_date to the insert object
    .insert([{ title, subject, priority, due_date, user_id: placeholderUserId }])
    .select();

  if (error) {
    console.error("Error inserting task:", error);
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}
