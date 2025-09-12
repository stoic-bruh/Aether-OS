'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const moodOptions = [
  { mood: 1, emoji: '😞' }, { mood: 2, emoji: '😕' },
  { mood: 3, emoji: '😐' }, { mood: 4, emoji: '😊' }, { mood: 5, emoji: '😁' },
];

export default function JournalForm() {
  const [mode, setMode] = useState<'morning' | 'evening'>('morning');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // State for all fields
  const [gratitude, setGratitude] = useState('');
  const [planForDay, setPlanForDay] = useState('');
  const [mentalWin, setMentalWin] = useState('');
  const [physicalWin, setPhysicalWin] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = mode === 'morning' 
      ? { type: 'morning', gratitude, plan_for_day: planForDay }
      : { type: 'evening', mental_win: mentalWin, physical_win: physicalWin, lesson_learned: lessonLearned, content, mood: selectedMood };

    await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Reset all fields
    setGratitude(''); setPlanForDay(''); setMentalWin('');
    setPhysicalWin(''); setLessonLearned(''); setContent(''); setSelectedMood(null);
    setIsLoading(false);
    router.refresh();
  };

  return (
    <div className="card-container">
      <div className="flex border-b border-neutral-800 mb-6">
        <button onClick={() => setMode('morning')} className={cn('py-2 px-4 transition-colors', mode === 'morning' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-neutral-400')}>Morning Kickstart</button>
        <button onClick={() => setMode('evening')} className={cn('py-2 px-4 transition-colors', mode === 'evening' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-neutral-400')}>Evening Debrief</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'morning' ? (
          <>
            <h2 className="text-xl font-semibold text-white">Morning Kickstart</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Today, I am grateful for...</label>
              <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} rows={3} className="input-field" disabled={isLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">My #1 goal to make today great is...</label>
              <textarea value={planForDay} onChange={(e) => setPlanForDay(e.target.value)} rows={3} className="input-field" disabled={isLoading} />
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white">Evening Debrief</h2>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">What was a mental win today?</label>
              <input type="text" value={mentalWin} onChange={(e) => setMentalWin(e.target.value)} className="input-field" disabled={isLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">What was a physical win today?</label>
              <input type="text" value={physicalWin} onChange={(e) => setPhysicalWin(e.target.value)} className="input-field" disabled={isLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">What's one lesson I learned?</label>
              <input type="text" value={lessonLearned} onChange={(e) => setLessonLearned(e.target.value)} className="input-field" disabled={isLoading} />
            </div>
             <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">General notes or reflections:</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="input-field" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Rate your overall mood today:</label>
              <div className="flex justify-around bg-neutral-900/50 p-2 rounded-lg">
                {moodOptions.map(({ mood, emoji }) => (
                  <button key={mood} type="button" onClick={() => setSelectedMood(mood)}
                    className={cn('text-3xl p-2 rounded-full transition-all duration-200', selectedMood === mood ? 'bg-cyan-500/20 scale-125' : 'hover:bg-neutral-800')}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : `Save ${mode === 'morning' ? 'Morning' : 'Evening'} Entry`}
        </button>
      </form>
    </div>
  );
}
