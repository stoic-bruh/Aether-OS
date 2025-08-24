// in app/components/NoteList.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NoteModal from './NoteModal';

type Note = {
  id: string;
  content: string;
  created_at: string;
  optimistic?: boolean;
};

export default function NoteList({ notes }: { notes: Note[] }) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    });
    router.refresh();
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-4">
        No notes yet. Use the floating button to add one.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
            onClick={() => setSelectedNote(note)}
          >
            <p className="text-neutral-200 truncate pr-4">{note.content}</p>
            <button 
              onClick={(e) => handleDelete(e, note.id)}
              className="text-neutral-500 hover:text-red-400 transition-colors flex-shrink-0"
            >
              &#x2715; 
            </button>
          </div>
        ))}
      </div>

      {selectedNote && (
        <NoteModal 
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </>
  );
}