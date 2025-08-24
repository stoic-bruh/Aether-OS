// in app/resources/page.tsx
export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import ResourceForm from '@/components/ResourceForm';
import ResourceList from '@/components/ResourceList';

export default async function ResourcesPage() {
  const { data: resources } = await supabase.from('resources').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Resource Hub</h1>
      <ResourceForm />
      <ResourceList resources={resources || []} />
    </div>
  );
}