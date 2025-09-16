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
    // New parameters from the frontend for customization
    const { resourceId, numQuestions, difficulty, questionTypes } = await request.json();

    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required." }, { status: 400 });
    }

    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('title, content, subject')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource || !resource.content) {
      throw new Error("Could not find the selected resource or it has no text content.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `
      You are an expert educator. Based on the following text about "${resource.subject}", generate a quiz with the following specifications:
      - Number of Questions: ${numQuestions}
      - Difficulty Level: ${difficulty}
      - Question Types: A mix of [${questionTypes.join(', ')}]

      Respond with ONLY a valid JSON object. The root object must have "title" and "questions" keys.
      EACH question object inside the "questions" array MUST have the following keys:
      - "type": One of [${questionTypes.join(', ')}].
      - "question": The question text.
      - "options": (For "mcq" type only) An array of 4 strings.
      - "correctAnswerIndex": (For "mcq" type only) The 0-based index of the correct option.
      - "correctAnswer": The correct answer. For "true_false", this must be a boolean (true or false). For others, a string.
      - "explanation": A brief, one-sentence explanation of WHY the answer is correct.

      TEXT CONTENT TO ANALYZE: """
      ${resource.content.substring(0, 8000)}
      """
    `.trim();

    const result = await model.generateContent(prompt);
    const quizJson = JSON.parse(cleanJsonString(result.response.text()));

    const { data: savedQuiz, error: saveError } = await supabase
      .from('quizzes')
      .insert({
        user_id: placeholderUserId,
        resource_id: resourceId,
        title: quizJson.title,
        questions: quizJson.questions,
      })
      .select()
      .single();
      
    if (saveError) throw saveError;

    return NextResponse.json(savedQuiz);

  } catch (error: any) {
    console.error("Error generating quiz:", error.message);
    return NextResponse.json({ error: "Failed to generate quiz. The AI may have returned an invalid format." }, { status: 500 });
  }
}