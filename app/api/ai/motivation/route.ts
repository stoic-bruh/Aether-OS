// in app/api/ai/motivation/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Fetch latest completed task
    const { data: latestTask } = await supabase
      .from("tasks")
      .select("title")
      .eq("completed", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 2. Find weakest subject (from our other AI logic)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: logs } = await supabase
      .from("study_logs")
      .select("subject, hours")
      .gte("log_date", sevenDaysAgo);

    const subjectHours: { [key: string]: number } = {};
    (logs || []).forEach(log => {
      if (log.subject) {
        subjectHours[log.subject] = (subjectHours[log.subject] || 0) + log.hours;
      }
    });

    let weakestSubject = "a new subject"; // Default message
    if (Object.keys(subjectHours).length > 0) {
      weakestSubject = Object.keys(subjectHours).reduce((a, b) => subjectHours[a] < subjectHours[b] ? a : b);
    }

    // 3. Construct the AI Prompt
    const accomplishment = latestTask ? `They recently completed the task: "${latestTask.title}".` : "They've been working hard.";
    const prompt = `You are Aether, a futuristic AI assistant in a personal OS. Your tone is cool, encouraging, and slightly sci-fi. Write a short, 1-2 sentence motivational message for the user. ${accomplishment} Their data suggests they should focus on "${weakestSubject}" next. Combine these facts into an inspiring message.`;

    // 4. Call the Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!geminiResponse.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const geminiData = await geminiResponse.json();
    const message = geminiData.candidates[0].content.parts[0].text;

    return NextResponse.json({ message: message.trim() });

  } catch (error) {
    console.error("Error generating motivational message:", error);
    return NextResponse.json({ message: "Keep up the great work. Data synchronization pending..." }, { status: 500 });
  }
}