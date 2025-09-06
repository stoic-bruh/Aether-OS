// in app/notes/page.tsx
export const revalidate = 0;
import { Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import NoteList from '@/components/NoteList';
import SkeletonCard from '@/components/SkeletonCard';

async function Notes() {
  const { data: notes } = await supabase.from('quick_notes').select('*').order('created_at', { ascending: false });
  return <NoteList notes={notes || []} />;
}

export default function NotesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Quick Notes</h1>
      <p className="text-neutral-400">Your central repository for fleeting thoughts and ideas. Use the global '+' button to add more.</p>
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
        <Notes />
      </Suspense>
    </div>
  );
}