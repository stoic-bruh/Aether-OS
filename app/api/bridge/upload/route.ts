import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { startOfTomorrow } from "date-fns";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const placeholderUserId = "00000000-0000-0000-0000-000000000000";

// Helper function to clean JSON responses from AI
function cleanJsonString(rawString: string): string {
  try {
    // First, try to find JSON wrapped in code blocks
    const jsonMatch = rawString.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }

    // If no code blocks, look for JSON object boundaries
    const jsonStart = rawString.indexOf('{');
    const jsonEnd = rawString.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      return rawString.substring(jsonStart, jsonEnd + 1);
    }

    // Return the raw string if no clear JSON boundaries found
    return rawString.trim();
  } catch (error) {
    console.error('Error cleaning JSON string:', error);
    return rawString.trim();
  }
}

// Validate content length and quality
function validateContent(text: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Content is required and must be text.' };
  }

  const trimmedText = text.trim();
  
  if (trimmedText.length < 10) {
    return { valid: false, error: 'Content is too short. Please provide at least 10 characters.' };
  }

  if (trimmedText.length > 50000) {
    return { valid: false, error: 'Content is too long. Please limit to 50,000 characters.' };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: "Invalid JSON format in request body." 
      }, { status: 400 });
    }

    const { text, subject, source } = body;

    // Validate required fields
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json({ 
        error: "Subject is required and must be a non-empty string." 
      }, { status: 400 });
    }

    // Validate content
    const contentValidation = validateContent(text);
    if (!contentValidation.valid) {
      return NextResponse.json({ 
        error: contentValidation.error 
      }, { status: 400 });
    }

    const trimmedText = text.trim();
    const trimmedSubject = subject.trim();
    const trimmedSource = source?.trim() || 'Import Form';

    // AI Decision Making
    const decisionModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      }
    });

    const decisionPrompt = `
You are an intelligent content classifier for AetherOS, an educational system. Analyze the provided content and determine the MOST APPROPRIATE action.

Available Actions:
- "CREATE_TASK" - For assignments, homework, project requirements, action items, to-dos
- "GENERATE_FLASHCARDS" - For study material, definitions, facts, concepts to memorize, educational content
- "SCHEDULE_EVENT" - For content mentioning specific dates, deadlines, appointments, meetings, events
- "SAVE_RESOURCE" - For general reference material, notes, information that doesn't fit other categories

Rules:
1. Only choose SCHEDULE_EVENT if there are specific dates or times mentioned
2. Prioritize CREATE_TASK for actionable items
3. Prioritize GENERATE_FLASHCARDS for educational/study content with clear concepts
4. Use SAVE_RESOURCE as fallback

Respond with ONLY valid JSON in this exact format:
{"action": "ACTION_NAME", "payload": "brief description of what will be created"}

Subject: "${trimmedSubject}"
Content: "${trimmedText.substring(0, 4000)}"
    `.trim();

    let decisionResult;
    try {
      decisionResult = await decisionModel.generateContent(decisionPrompt);
    } catch (aiError: any) {
      console.error('AI Decision Error:', aiError);
      
      if (aiError.message?.includes('quota') || aiError.message?.includes('limit')) {
        return NextResponse.json({ 
          error: "AI service temporarily unavailable. Please try again later." 
        }, { status: 429 });
      }
      
      // Fall back to saving as resource
      await saveAsResource(trimmedText, trimmedSubject, trimmedSource);
      return NextResponse.json({ 
        message: "Content saved as resource (AI analysis unavailable).",
        action: "SAVE_RESOURCE",
        contentLength: trimmedText.length 
      });
    }

    // Parse AI decision
    let decisionJson;
    try {
      const cleanedResponse = cleanJsonString(decisionResult.response.text());
      decisionJson = JSON.parse(cleanedResponse);
      
      // Validate response structure
      if (!decisionJson.action || !decisionJson.payload) {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error("Decision parsing error:", parseError);
      console.log("Raw AI response:", decisionResult.response.text());
      
      // Default fallback
      decisionJson = { 
        action: "SAVE_RESOURCE", 
        payload: "Saved as reference material" 
      };
    }

    const { action, payload } = decisionJson;
    let responseMessage = "Content processed successfully.";

    // Execute AI Decision
    try {
      switch (action) {
        case 'CREATE_TASK':
          await createTask(payload, trimmedText, trimmedSubject);
          responseMessage = `New task created: "${payload}"`;
          break;

        case 'GENERATE_FLASHCARDS':
          const flashcardCount = await generateFlashcards(trimmedText, trimmedSubject, decisionModel);
          if (flashcardCount > 0) {
            responseMessage = `Generated ${flashcardCount} flashcards for "${trimmedSubject}" - check the Practice section!`;
          } else {
            responseMessage = "Could not generate flashcards, but content saved as reference material.";
          }
          break;

        case 'SCHEDULE_EVENT':
          await scheduleEvent(payload, trimmedText);
          responseMessage = `Event scheduled for tomorrow: "${payload}"`;
          break;

        default:
          responseMessage = "Content analyzed and saved to Resources.";
          break;
      }
    } catch (actionError: any) {
      console.error("Action execution error:", actionError);
      responseMessage = "Primary action failed, but content saved as reference material.";
    }

    // Always save as resource (backup)
    await saveAsResource(trimmedText, trimmedSubject, trimmedSource);

    return NextResponse.json({ 
      message: responseMessage,
      action: action,
      contentLength: trimmedText.length 
    });

  } catch (error: any) {
    console.error("Error in import bridge:", error);
    return NextResponse.json({ 
      error: "Failed to process content. Please try again or contact support." 
    }, { status: 500 });
  }
}

// Helper function to create task
async function createTask(title: string, content: string, subject: string) {
  const taskResult = await supabase.from('tasks').insert({
    title: title || `Task from ${subject}`,
    description: content.substring(0, 500),
    subject,
    priority: 2,
    user_id: placeholderUserId,
    created_at: new Date().toISOString()
  });
  
  if (taskResult.error) {
    throw new Error(`Failed to create task: ${taskResult.error.message}`);
  }
}

// Helper function to generate flashcards
async function generateFlashcards(content: string, subject: string, model: any): Promise<number> {
  try {
    const flashcardPrompt = `
Create 3-7 high-quality flashcards from the provided content about "${subject}".

Guidelines:
- Focus on key concepts, definitions, and important facts
- Make questions clear and specific
- Keep answers concise but complete
- Ensure each flashcard tests understanding of a distinct concept

Content: "${content.substring(0, 6000)}"

Respond with ONLY a valid JSON array of objects with "question" and "answer" properties:
[{"question": "What is...", "answer": "..."}, {"question": "How does...", "answer": "..."}]
    `.trim();
    
    const flashcardResult = await model.generateContent(flashcardPrompt);
    const cleanedResponse = cleanJsonString(flashcardResult.response.text());
    const flashcardsJson = JSON.parse(cleanedResponse);
    
    if (!Array.isArray(flashcardsJson) || flashcardsJson.length === 0) {
      throw new Error("AI did not return a valid flashcard array");
    }
    
    const flashcardData = flashcardsJson.map((card: any) => ({
      question: card.question || 'Question not provided',
      answer: card.answer || 'Answer not provided',
      subject,
      user_id: placeholderUserId,
      created_at: new Date().toISOString()
    }));

    const insertResult = await supabase.from('flashcards').insert(flashcardData);
    if (insertResult.error) {
      throw new Error(`Failed to insert flashcards: ${insertResult.error.message}`);
    }
    
    return flashcardData.length;
  } catch (error: any) {
    console.error("Flashcard generation error:", error);
    return 0;
  }
}

// Helper function to schedule event
async function scheduleEvent(title: string, content: string) {
  const tomorrow = startOfTomorrow();
  const eventResult = await supabase.from('planned_events').insert({
    title: title || 'Imported Event',
    description: content.substring(0, 500),
    start_time: tomorrow.toISOString(),
    end_time: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
    user_id: placeholderUserId,
    created_at: new Date().toISOString()
  });
  
  if (eventResult.error) {
    throw new Error(`Failed to schedule event: ${eventResult.error.message}`);
  }
}

// Helper function to save as resource
async function saveAsResource(content: string, subject: string, source: string) {
  try {
    const resourceResult = await supabase.from('resources').insert({
      title: `${subject} - Imported ${new Date().toLocaleDateString()}`,
      subject,
      type: 'Text Import',
      content,
      source,
      user_id: placeholderUserId,
      created_at: new Date().toISOString()
    });
    
    if (resourceResult.error) {
      console.error("Resource save error:", resourceResult.error);
    }
  } catch (error) {
    console.error("Error saving resource:", error);
    // Don't throw - this is a backup operation
  }
}