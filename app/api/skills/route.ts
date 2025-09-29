import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from 'next/server';

const placeholderUserId = "00000000-0000-0000-0000-000000000000";

export async function POST(request: NextRequest) {
  try {
    const { name, goal_id } = await request.json();

    if (!name || !goal_id) {
      return NextResponse.json({ error: "Name and goal_id are required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('skills')
      .insert([
        {
          user_id: placeholderUserId,
          name,
          goal_id,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to create skill." }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error creating skill:", error.message);
    return NextResponse.json({ error: "Failed to create skill." }, { status: 500 });
  }
}

export const revalidate = 0;