import { JournalEntry } from '@/lib/types';
import { Sun, Moon, Brain, Heart, Award, Sparkles, BookText } from 'lucide-react';

const moodEmojis: { [key: number]: string } = {
  1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁',
};

const EntryItem = ({ icon, label, text }: { icon: React.ElementType, label: string, text: string | null | undefined }) => {
  if (!text) return null;
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-neutral-500 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-neutral-300">{label}</p>
        <p className="text-sm text-neutral-400">{text}</p>
      </div>
    </div>
  );
};

export default function JournalList({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4">Past Entries</h2>
      <div className="space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {entry.type === 'morning' ? 
                    <Sun className="h-5 w-5 text-yellow-400" /> : 
                    <Moon className="h-5 w-5 text-blue-400" />
                  }
                  <h3 className="font-bold text-white">
                    {entry.type === 'morning' ? 'Morning Kickstart' : 'Evening Debrief'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                   {entry.mood && <span className="text-2xl">{moodEmojis[entry.mood] || '🤔'}</span>}
                   <p className="text-xs text-neutral-500">{new Date(entry.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3 pl-1 border-l-2 border-neutral-700/50 ml-2">
                <EntryItem icon={Heart} label="Grateful for..." text={entry.gratitude} />
                <EntryItem icon={Award} label="Day's Goal..." text={entry.plan_for_day} />
                <EntryItem icon={Brain} label="Mental Win" text={entry.mental_win} />
                <EntryItem icon={Sparkles} label="Physical Win" text={entry.physical_win} />
                <EntryItem icon={BookText} label="Lesson Learned" text={entry.lesson_learned} />
                <EntryItem icon={BookText} label="General Notes" text={entry.content} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-8">No journal entries yet.</p>
        )}
      </div>
    </div>
  );
}
