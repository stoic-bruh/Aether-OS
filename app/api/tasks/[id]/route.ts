import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// PATCH to update task completion status and award XP
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { completed } = await request.json();

  // Award XP if the task is being marked as complete (i.e., completed is true)
  if (completed) {
    const placeholderUserId = "00000000-0000-0000-0000-000000000000";
    // This is a special Supabase function to increment a value atomically
    await supabase.rpc('increment_xp', { user_id_param: placeholderUserId, xp_amount: 25 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ completed: completed })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

// GET a single task by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT to update a task by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();

  const { error } = await supabase
    .from("tasks")
    .update(body)
    .eq("id", id);

  if (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }

  return NextResponse.json({ message: "Task updated successfully" });
}

// DELETE a task by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}