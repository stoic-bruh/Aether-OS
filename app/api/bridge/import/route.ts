import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

// ✅ Initialize Gemini API
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("Missing GOOGLE_GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// ✅ Helper: Clean JSON output from AI
function cleanJsonString(rawString: string): string {
  const jsonStart = rawString.indexOf('[');
  const jsonEnd = rawString.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("Raw AI response:", rawString);
    throw new Error("Could not find a valid JSON array in the AI's response.");
  }
  return rawString.substring(jsonStart, jsonEnd + 1);
}

// ✅ Main Route Handler
export async function POST(request: Request) {
  const { text, subject, source } = await request.json();
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!text || !subject) {
    return NextResponse.json({ error: "Text and subject are required." }, { status: 400 });
  }

  try {
    // --- ACTION 1: Save to Study Logs ---
    const { data: logData, error: logError } = await supabase
      .from('study_logs')
      .insert({
        subject,
        hours: 0,
        details: `Imported from ${source || 'Unknown Source'}:\n\n${text}`,
        user_id: placeholderUserId
      })
      .select()
      .single();

    if (logError) throw logError;

    // --- ACTION 2: Create Resource Hub Entry ---
    const resourceTitle = `Imported Notes on: ${subject}`;
    const { error: resourceError } = await supabase
      .from('resources')
      .insert({
        title: resourceTitle,
        url: '',
        content: text,
        type: 'Imported Text',
        subject,
        user_id: placeholderUserId
      });

    if (resourceError) throw resourceError;

    // --- ACTION 3: Generate Flashcards via Gemini ---
    const prompt = `
You are an expert flashcard creator. 
Based on the following text about "${subject}", generate 5-10 short, clear flashcards in valid JSON format.
Each item should have "question" and "answer" fields only. 
Return only a pure JSON array — no markdown, no explanations.

TEXT:
"""${text}"""
`;

    // ✅ Fixed model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const rawResponseText = result.response.text();

    // ✅ Clean and parse JSON
    const cleanResponseText = cleanJsonString(rawResponseText);
    const flashcards = JSON.parse(cleanResponseText);

    // --- ACTION 4: Insert Flashcards into Supabase ---
    const flashcardData = flashcards.map((card: { question: string; answer: string }) => ({
      question: card.question,
      answer: card.answer,
      subject,
      source_log_id: logData.id,
      user_id: placeholderUserId,
    }));

    const { error: flashcardError } = await supabase.from('flashcards').insert(flashcardData);
    if (flashcardError) throw flashcardError;

    // ✅ Return Success
    return NextResponse.json({
      message: "Import successful, resource saved, and flashcards generated!",
      flashcardsCount: flashcards.length,
    });

  } catch (error) {
    console.error("Error in import bridge:", error);
    return NextResponse.json(
      { error: "Failed to process import.", details: (error as Error).message },
      { status: 500 }
    );
  }
}
