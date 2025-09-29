import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from 'next/server';

const placeholderUserId = "00000000-0000-0000-0000-000000000000";

export async function POST(request: NextRequest) {
  try {
    const { title, description, target_date, deadline, is_primary } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: placeholderUserId,
          title,
          description,
          target_date,
          deadline,
          is_primary: is_primary || false,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to create goal." }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error creating goal:", error.message);
    return NextResponse.json({ error: "Failed to create goal." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', placeholderUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to fetch goals." }, { status: 500 });
    }

    return NextResponse.json(goals || []);

  } catch (error: any) {
    console.error("Error fetching goals:", error.message);
    return NextResponse.json({ error: "Failed to fetch goals." }, { status: 500 });
  }
}

export const revalidate = 0;