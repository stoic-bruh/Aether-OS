import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json({ error: "Tasks array is required." }, { status: 400 });
    }

    // Add created_at and due_date to each task
    const tasksWithDefaults = tasks.map(task => ({
      ...task,
      created_at: new Date().toISOString(),
      due_date: task.due_date || null,
    }));

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksWithDefaults)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to create tasks." }, { status: 500 });
    }

    return NextResponse.json({ tasks: data || [], count: data?.length || 0 });

  } catch (error: any) {
    console.error("Error creating tasks:", error.message);
    return NextResponse.json({ error: "Failed to create tasks." }, { status: 500 });
  }
}

export const revalidate = 0;