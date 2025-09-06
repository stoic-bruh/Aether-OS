import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, start_time, end_time, type } = body;
    const placeholderUserId = "00000000-0000-0000-0000-000000000000";

    if (!title || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("planned_events")
      .insert([{ title, start_time, end_time, type, user_id: placeholderUserId }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("Error creating planned event:", error.message);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }
}