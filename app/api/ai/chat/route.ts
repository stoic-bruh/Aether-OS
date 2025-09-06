// in app/api/ai/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  try {
    // Step 1: Intelligently identify the topic of the user's question
    const { data: allResources } = await supabase.from('resources').select('subject');
    const uniqueSubjects = [...new Set((allResources || []).map(r => r.subject).filter(Boolean))];
    const topicIdentificationPrompt = `Based on the user's question, identify the single most relevant subject from the following list. If no subject seems relevant, respond with "None". List of subjects: [${uniqueSubjects.join(', ')}]. Question: "${lastUserMessage}"`;
    
    const topicModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const topicResult = await topicModel.generateContent(topicIdentificationPrompt);
    let relevantSubject = topicResult.response.text().trim();

    // Step 2: Fetch all relevant data from the database
    const [
      { data: tasks },
      { data: quickNotes },
      { data: relevantResources }
    ] = await Promise.all([
      supabase.from('tasks').select('title, subject, priority, completed').limit(15),
      supabase.from('quick_notes').select('content').order('created_at', { ascending: false }).limit(15),
      (relevantSubject && relevantSubject.toLowerCase() !== 'none') 
        ? supabase.from('resources').select('title, content').eq('subject', relevantSubject).limit(5)
        : Promise.resolve({ data: [] })
    ]);

    // Step 3: Construct the final, context-rich prompt for the AI
    const finalSystemPrompt = `
      You are Aether, a futuristic AI assistant. Use the following context from the user's AetherOS to provide an intelligent, context-aware response.
      GENERAL CONTEXT:
      {
        "tasks": ${JSON.stringify(tasks)},
        "quick_notes": ${JSON.stringify(quickNotes)}
      }
      USER'S KNOWLEDGE BASE ON "${relevantSubject}":
      {
        "resources": ${JSON.stringify(relevantResources)}
      }
    `;

    const answerModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: finalSystemPrompt,
    });
    
    const streamingResponse = await answerModel.generateContentStream(lastUserMessage);

    // Step 4: Stream the response back to the user
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
    console.error("Error in AI chat route:", error);
    return new Response("Error from AI service.", { status: 500 });
  }
}