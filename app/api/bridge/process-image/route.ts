import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs'; // Required for file handling

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const placeholderUserId = "00000000-0000-0000-0000-000000000000";

async function fileToGenerativePart(file: File) {
  const base64EncodedData = Buffer.from(await file.arrayBuffer()).toString("base64");
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;

    if (!file || !subject) {
      return NextResponse.json({ error: "File and subject are required." }, { status: 400 });
    }

    // 1. Upload the image to Supabase Storage
    const filePath = `${placeholderUserId}/${Date.now()}-${file.name}`;
    await supabase.storage.from('image_uploads').upload(filePath, file);
    const { data: { publicUrl } } = supabase.storage.from('image_uploads').getPublicUrl(filePath);

    // 2. Ask the AI to describe the image
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const imagePart = await fileToGenerativePart(file);
    const prompt = "Describe this image in detail. If it contains text, transcribe it. What are the key objects or concepts shown?";
    
    const result = await model.generateContent([prompt, imagePart]);
    const description = result.response.text();

    // 3. Save the image and its AI-generated description as a new Resource
    await supabase.from('resources').insert({
      title: file.name,
      subject,
      type: 'Image',
      url: publicUrl,
      content: description, // The AI's description becomes the content
      user_id: placeholderUserId,
    });

    return NextResponse.json({ 
      message: "Image processed successfully and saved to Resources.",
      description: description,
      url: publicUrl,
    });

  } catch (error: any) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image." }, { status: 500 });
  }
}
