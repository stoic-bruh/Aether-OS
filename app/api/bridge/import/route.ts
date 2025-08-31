import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

function cleanJsonString(rawString: string): string {
  const jsonStart = rawString.indexOf('[');
  const jsonEnd = rawString.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Could not find a valid JSON array in the AI's response.");
  }
  return rawString.substring(jsonStart, jsonEnd + 1);
}

export async function POST(request: Request) {
  const { text, subject, source } = await request.json();
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";

  if (!text || !subject) {
    return NextResponse.json({ error: "Text and subject are required." }, { status: 400 });
  }

  try {
    // Action 1: Save the imported text as a new study log entry
    const { data: logData, error: logError } = await supabase
      .from('study_logs')
      .insert({ subject, hours: 0, details: `Imported from ${source}:\n\n${text}`, user_id: placeholderUserId })
      .select()
      .single();
    if (logError) throw logError;
    
    // --- NEW ACTION ---
    // Action 2: Create a corresponding entry in the Resource Hub
    const resourceTitle = `Imported Notes on: ${subject}`;
    const { error: resourceError } = await supabase
      .from('resources')
      .insert({
        title: resourceTitle,
        url: '', // No URL for imported text
        content: text, // Store the full text
        type: 'Imported Text',
        subject: subject,
        user_id: placeholderUserId
      });
    if (resourceError) throw resourceError;
    // --- END OF NEW ACTION ---

    // Action 3: Prompt Gemini to generate flashcards
    const prompt = `Based on the following text about "${subject}", generate 5-10 high-quality flashcards in a valid JSON array format. Each object must have "question" and "answer" keys. Do not include any text outside of the JSON array. TEXT: """${text}"""`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const rawResponseText = result.response.text();
    
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

    return NextResponse.json({ message: "Import successful, resource saved, and flashcards generated!" });

  } catch (error) {
    console.error("Error in import bridge:", error);
    return NextResponse.json({ error: "Failed to process import." }, { status: 500 });
  }
}
