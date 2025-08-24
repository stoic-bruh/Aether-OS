// in app/api/tasks/[id]/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
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
// To DELETE a task
export async function DELETE(
  request: Request,
  context: { params: { id: string } } // Changed this line
) {
  const id = context.params.id; // And added this line

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}