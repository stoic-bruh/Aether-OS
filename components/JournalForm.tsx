// in app/components/JournalForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const moodOptions = [
  { mood: 1, emoji: '😞' },
  { mood: 2, emoji: '😕' },
  { mood: 3, emoji: '😐' },
  { mood: 4, emoji: '😊' },
  { mood: 5, emoji: '😁' },
];

export default function JournalForm() {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedMood) {
      alert("Please write something and select your mood.");
      return;
    }

    setIsLoading(true);
    await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mood: selectedMood }),
    });

    setIsLoading(false);
    setContent('');
    setSelectedMood(null);
    router.refresh();
  };

  return (
    <div className="card-container mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">New Reflection</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you learn today? How are you feeling?"
          className="input-field"
          rows={6}
          disabled={isLoading}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400">Rate your mood:</label>
          <div className="flex justify-around bg-neutral-900/50 p-2 rounded-lg">
            {moodOptions.map(({ mood, emoji }) => (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`text-3xl p-2 rounded-full transition-all duration-200 ${selectedMood === mood ? 'bg-cyan-500/20 scale-125' : 'hover:bg-neutral-800'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}