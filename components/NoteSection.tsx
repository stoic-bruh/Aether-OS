// in app/components/NoteSection.tsx
'use client';

import { useOptimistic, startTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import QuickNoteForm from '@/components/QuickNoteForm';
import NoteList from '@/components/NoteList';

// Define the shape of our note object
type Note = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  optimistic?: boolean; // A flag to style the note while it's pending
};

// The component takes the initial notes from the server as a prop
export default function NoteSection({ serverNotes }: { serverNotes: Note[] }) {
  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    serverNotes,
    (state: Note[], newNoteContent: string) => [
      {
        id: crypto.randomUUID(), // Create a temporary ID
        content: newNoteContent,
        created_at: new Date().toISOString(),
        user_id: "00000000-0000-0000-0000-000000000000",
        optimistic: true, // Mark this note as optimistic
      },
      ...state,
    ]
  );

  // This function will be called by the form to add a new note
  const handleAddNote = async (content: string) => {
    // 1. Immediately update the UI optimistically
    startTransition(() => {
      addOptimisticNote(content);
    });

    // 2. Then, send the actual request to the server
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    // We don't need router.refresh() anymore because Next.js handles revalidating
  };

  return (
    <Card className="card-container flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Quick Notes</h2>
        {/* Pass the handleAddNote function to the form */}
        <QuickNoteForm onAddNote={handleAddNote} />
      </div>
      {/* Display the optimistic list of notes */}
      <NoteList notes={optimisticNotes} />
    </Card>
  );
}
