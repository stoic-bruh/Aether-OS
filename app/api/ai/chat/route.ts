// in app/api/ai/chat/route.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // --- 1. Gather Context from Your Database ---
  const [
    { data: tasks },
    { data: notes },
    { data: studyLogs }
  ] = await Promise.all([
    supabase.from('tasks').select('title, subject, priority, completed').limit(10),
    supabase.from('quick_notes').select('content').limit(10),
    supabase.from('study_logs').select('subject, hours').limit(10)
  ]);

  // --- 2. Construct the Context-Rich Prompt ---
  // We combine the AI's persona and all your data into one block.
  const contextBlock = `
    System Preamble: You are Aether, a futuristic AI assistant integrated into a personal productivity OS. Your tone is cool, helpful, and slightly sci-fi.
    Use the following data context from the user's AetherOS to provide an intelligent, personalized, and context-aware response.
    ---
    CONTEXT:
    {
      "recent_tasks": ${JSON.stringify(tasks)},
      "recent_notes": ${JSON.stringify(notes)},
      "recent_study_logs": ${JSON.stringify(studyLogs)}
    }
    ---
  `;

  // --- 3. Combine Context with Conversation History ---
  // We add the context block as the first "user" message to ensure the AI always sees it.
  const contents = [
    ...messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user', // Gemini uses 'model' for the assistant role
      parts: [{ text: msg.content }],
    }))
  ];
  // Inject the context at the beginning of the conversation
  contents[0].parts[0].text = contextBlock + "\n\nUser Question: " + contents[0].parts[0].text;

  // --- 4. Call Gemini and Stream the Response ---
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const streamingResponse = await model.generateContentStream({ contents });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of streamingResponse.stream) {
          controller.enqueue(encoder.encode(chunk.text()));
        }
        controller.close();
      },
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

  } catch (error) {
    console.error("Error generating content stream:", error);
    return new Response("Error from AI service.", { status: 500 });
  }
}