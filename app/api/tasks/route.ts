import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET: Fetches the entire list of tasks, ordered by creation date.
 */
export async function GET(request: NextRequest) {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    return NextResponse.json({ error: "Failed to fetch tasks.", details: error.message }, { status: 500 });
  }
}

/**
 * POST: Creates one new task with all its details.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, priority, due_date } = body;
    const placeholderUserId = "00000000-0000-0000-0000-000000000000";

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ 
        title, 
        subject, 
        priority, 
        due_date, 
        user_id: placeholderUserId 
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error inserting task:", error.message);
    return NextResponse.json({ error: "Failed to create task.", details: error.message }, { status: 500 });
  }
}

