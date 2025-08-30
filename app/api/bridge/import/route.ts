import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// Helper function to extract JSON from the AI's markdown response
function cleanJsonString(rawString: string): string {
  // Find the start of the JSON array
  const jsonStart = rawString.indexOf('[');
  // Find the end of the JSON array
  const jsonEnd = rawString.lastIndexOf(']');

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Could not find a valid JSON array in the AI's response.");
  }

  // Extract just the JSON part
  return rawString.substring(jsonStart, jsonEnd + 1);
}

export async function POST(request: Request) {
  const { text, subject, source } = await request.json();
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!text || !subject) {
    return NextResponse.json({ error: "Text and subject are required." }, { status: 400 });
  }

  try {
    // 1. Save the imported text as a new study log entry
    const { data: logData, error: logError } = await supabase
      .from('study_logs')
      .insert({
        subject: subject,
        hours: 0, // Set hours to 0 for imported content
        details: `Imported from ${source}:\n\n${text}`,
        user_id: placeholderUserId
      })
      .select()
      .single();

    if (logError) throw logError;
    
    // 2. Prompt Gemini to generate flashcards in JSON format
    const prompt = `Based on the following text about "${subject}", generate 5-10 high-quality flashcards. The flashcards should be in a valid JSON array format. Each object in the array must have two keys: "question" and "answer". Do not include any text outside of the JSON array.
    
    TEXT: """
    ${text}
    """`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const rawResponseText = result.response.text();
    
    // 3. Clean the AI's response and parse the JSON
    const cleanResponseText = cleanJsonString(rawResponseText);
    const flashcards = JSON.parse(cleanResponseText);
    
    const flashcardData = flashcards.map((card: { question: string, answer: string }) => ({
      question: card.question,
      answer: card.answer,
      subject: subject,
      source_log_id: logData.id,
      user_id: placeholderUserId,
    }));
    
    const { error: flashcardError } = await supabase.from('flashcards').insert(flashcardData);

    if (flashcardError) throw flashcardError;

    return NextResponse.json({ message: "Import successful, flashcards generated!" });

  } catch (error) {
    console.error("Error in import bridge:", error);
    // Provide a more specific error message if JSON parsing failed
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: "Failed to parse the AI's response. The format was invalid." }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to process import and generate flashcards." }, { status: 500 });
  }
}
