import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const placeholderUserId = "00000000-0000-0000-0000-000000000000";

function cleanJsonString(rawString: string): string {
  const jsonMatch = rawString.match(/```json\n([\s\S]*?)```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : rawString.trim();
  return jsonString;
}

export async function POST(request: NextRequest) {
  try {
    const { skillName, goalTitle } = await request.json();

    if (!skillName || !goalTitle) {
      return NextResponse.json({ error: "Skill name and goal title are required." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `
      You are a senior career coach and technical project manager. A student has a long-term goal to "${goalTitle}" and wants to learn the skill "${skillName}".

      Your task is to break down this skill into a list of 5-7 concrete, actionable tasks or mini-projects that will help them learn. The tasks should be clear and achievable.

      Respond with ONLY a valid JSON array of strings. Each string in the array should be a task title.
      
      Example response:
      [
        "Set up a Python environment with Pandas and Jupyter",
        "Complete a tutorial on data cleaning with Pandas",
        "Analyze a sample dataset from Kaggle and create 3 visualizations",
        "Build a simple web scraper to collect data",
        "Write a blog post explaining the findings of a data analysis project"
      ]
    `.trim();

    const result = await model.generateContent(prompt);
    const taskTitles = JSON.parse(cleanJsonString(result.response.text()));

    return NextResponse.json({ tasks: taskTitles });

  } catch (error: any) {
    console.error("Error generating skill plan:", error.message);
    return NextResponse.json({ error: "Failed to generate plan from AI." }, { status: 500 });
  }
}
