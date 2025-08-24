// in app/components/JournalList.tsx
type JournalEntry = {
  id: string;
  content: string;
  mood: number;
  created_at: string;
};

const moodEmojis: { [key: number]: string } = {
  1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁',
};

export default function JournalList({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4">Past Entries</h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-4xl">{moodEmojis[entry.mood] || '🤔'}</span>
                <p className="text-xs text-neutral-500 text-right">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-neutral-300 whitespace-pre-wrap break-words">{entry.content}</p>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-8">No journal entries yet.</p>
        )}
      </div>
    </div>
  );
}