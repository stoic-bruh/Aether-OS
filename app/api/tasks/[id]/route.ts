import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET: Fetches one single task by its ID.
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching task:", error.message);
    return NextResponse.json({ error: "Failed to fetch task.", details: error.message }, { status: 500 });
  }
}

/**
 * PATCH: Partially updates a task (e.g., marks as complete, changes title).
 * Also awards 25 XP when a task is marked as complete.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const body = await request.json();

    if (body.completed === true) {
      const placeholderUserId = "00000000-0000-0000-0000-000000000000";
      await supabase.rpc('increment_xp', { user_id_param: placeholderUserId, xp_amount: 25 });
    }

    const { data, error } = await supabase.from("tasks").update(body).eq("id", id).select().single();
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating task (PATCH):", error.message);
    return NextResponse.json({ error: "Failed to update task.", details: error.message }, { status: 500 });
  }
}

/**
 * PUT: Replaces an entire task's data. Useful for full edits.
 */
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const body = await request.json();

    const { error } = await supabase.from("tasks").update(body).eq("id", id);
    if (error) {
      throw error;
    }
    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error: any) {
    console.error("Error updating task (PUT):", error.message);
    return NextResponse.json({ error: "Failed to update task.", details: error.message }, { status: 500 });
  }
}

/**
 * DELETE: Deletes one specific task.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    return NextResponse.json({ error: "Failed to delete task.", details: error.message }, { status: 500 });
  }
}

