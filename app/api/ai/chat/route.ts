import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  try {
    // --- Step 1: Identify the Topic ---
    const { data: resources } = await supabase.from('resources').select('subject');
    const uniqueSubjects = [...new Set((resources || []).map(r => r.subject).filter(Boolean))];

    const topicIdentificationPrompt = `Based on the user's question, identify the single most relevant subject from the following list. If no subject is relevant, respond with "None". List of subjects: [${uniqueSubjects.join(', ')}]. Question: "${lastUserMessage}"`;
    
    const topicModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const topicResult = await topicModel.generateContent(topicIdentificationPrompt);
    let relevantSubject = topicResult.response.text().trim();

    let contextText = '';
    // --- Step 2: Retrieve Context for the Identified Topic ---
    if (relevantSubject && relevantSubject.toLowerCase() !== 'none') {
      const { data: relevantResources } = await supabase
        .from('resources')
        .select('title, content')
        .eq('subject', relevantSubject)
        .limit(5); // Get the 5 most recent resources for that subject

      if (relevantResources && relevantResources.length > 0) {
        contextText = `
          ---
          Here is the user's curated knowledge on the subject "${relevantSubject}". Use this information to answer their question.
          RESOURCES:
          ${JSON.stringify(relevantResources)}
          ---
        `;
      }
    }

    // --- Step 3: Answer the Question with the Retrieved Context ---
    const finalPrompt = `
      System Preamble: You are Aether, a futuristic AI assistant.
      ${contextText}
    `;

    const answerModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: finalPrompt,
    });
    
    // We send only the last message for the final generation, as the context is in the system prompt
    const streamingResponse = await answerModel.generateContentStream(lastUserMessage);

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

