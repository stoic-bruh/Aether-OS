// in app/api/logs/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// To fetch all study logs
export async function GET() {
  const { data: logs, error } = await supabase
    .from("study_logs")
    .select("*")
    .order("log_date", { ascending: false });

  if (error) {
    console.error("Error fetching study logs:", error);
    return NextResponse.json({ error: "Failed to fetch study logs" }, { status: 500 });
  }

  return NextResponse.json(logs);
}

// To create a new study log
export async function POST(request: Request) {
  const { subject, hours, details } = await request.json(); 
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!subject || !hours) {
    return NextResponse.json({ error: "Subject and hours are required." }, { status: 400 });
  }

  // Calculate XP to award: 50 XP per hour
  const xpGained = Math.floor(hours * 50);
  await supabase.rpc('increment_xp', { user_id_param: placeholderUserId, xp_amount: xpGained });

  const { data, error } = await supabase
    .from("study_logs")
    .insert([{ subject, hours, details, user_id: placeholderUserId }]) 
    .select();

  if (error) {
    console.error("Error inserting study log:", error);
    return NextResponse.json({ error: "Failed to create study log." }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}