// in app/components/QuickNoteForm.tsx
'use client';
import { useState } from 'react';

// The form now accepts an onAddNote function as a prop
export default function QuickNoteForm({ onAddNote }: { onAddNote: (content: string) => Promise<void> }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    await onAddNote(content); // Call the function passed from the parent
    setIsLoading(false);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Jot down a quick idea..."
        className="input-field"
        rows={4}
        disabled={isLoading}
      />
      <div className="flex items-center justify-end">
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </form>
  );
}