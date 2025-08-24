// in app/api/ai/suggestion/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Get study logs from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: logs, error } = await supabase
    .from("study_logs")
    .select("subject, hours")
    .gte("log_date", sevenDaysAgo); // gte means "greater than or equal to"

  if (error) {
    console.error("Error fetching logs for AI suggestion:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }

  if (!logs || logs.length === 0) {
    return NextResponse.json({ suggestion: "Log some study sessions to get your first AI suggestion!" });
  }

  // 2. Process the data to find total hours per subject
  const subjectHours: { [key: string]: number } = {};
  for (const log of logs) {
    if (!subjectHours[log.subject]) {
      subjectHours[log.subject] = 0;
    }
    subjectHours[log.subject] += log.hours;
  }

  // 3. Find the subject with the minimum hours
  let leastStudiedSubject = "";
  let minHours = Infinity;

  for (const subject in subjectHours) {
    if (subjectHours[subject] < minHours) {
      minHours = subjectHours[subject];
      leastStudiedSubject = subject;
    }
  }

  // 4. Formulate the suggestion
  const suggestion = `You've spent the least time on **${leastStudiedSubject}** this week. Maybe focus on that next?`;

  return NextResponse.json({ suggestion });
}