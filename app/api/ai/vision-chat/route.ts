import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// This file now only depends on the stable Google AI library

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

// The vision model works well on the faster edge runtime
export const runtime = 'edge'; 

// Helper function to convert a fetched image into the format the AI needs
async function fileToGenerativePart(buffer: ArrayBuffer, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString("base64"),
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, imageUrl } = await req.json();

    if (!messages || !imageUrl) {
      return NextResponse.json({ error: "Missing messages or imageUrl in request." }, { status: 400 });
    }

    // Get the last message from the user to send to the AI
    const lastUserMessage = messages[messages.length - 1];

    // 1. Fetch the image from its public Supabase Storage URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageMimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // 2. Convert the image to the correct format
    const imagePart = await fileToGenerativePart(imageBuffer, imageMimeType);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // 3. Send both the user's text prompt and the image data to the AI
    const result = await model.generateContentStream({
      contents: [{
        role: 'user',
        parts: [
          { text: lastUserMessage.content },
          imagePart,
        ]
      }]
    });
    
    // 4. Manually create a streaming response to send back to the chat interface
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          controller.enqueue(encoder.encode(chunk.text()));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error("Error in vision chat API:", error);
    return NextResponse.json({ error: "Failed to get response from AI.", details: error.message }, { status: 500 });
  }
}