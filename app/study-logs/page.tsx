// in app/study-logs/page.tsx
export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import StudyLogForm from '@/components/StudyLogForm';
import StudyLogList from '@/components/StudyLogList';
import WeaknessRadarChart from '@/components/StudyRadarChart';

export default async function StudyLogsPage() {
  const { data: studyLogs } = await supabase.from('study_logs').select('*').order('log_date', { ascending: false });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Personal Learning Analytics</h1>
      <StudyLogForm />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <StudyLogList logs={studyLogs || []} />
        <WeaknessRadarChart logs={studyLogs || []} />
      </div>
    </div>
  );
}