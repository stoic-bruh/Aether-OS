import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, content, mood, 
      gratitude, plan_for_day, 
      mental_win, physical_win, lesson_learned 
    } = body;
    
    const placeholderUserId = "00000000-0000-0000-0000-000000000000";

    if (!type) {
      return NextResponse.json({ error: "Entry type is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .insert([{ 
        type, content, mood, 
        gratitude, plan_for_day, 
        mental_win, physical_win, lesson_learned,
        user_id: placeholderUserId 
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("Error inserting journal entry:", error.message);
    return NextResponse.json({ error: "Failed to create entry." }, { status: 500 });
  }
}
