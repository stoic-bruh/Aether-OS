// in app/journal/page.tsx
export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import JournalForm from '@/components/JournalForm';
import JournalList from '@/components/JournalList';

export default async function JournalPage() {
  const { data: entries } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Journal & Reflections</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <JournalForm />
        <JournalList entries={entries || []} />
      </div>
    </div>
  );
}