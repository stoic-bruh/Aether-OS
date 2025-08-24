// in app/components/StudyLogList.tsx
'use client';
import { useState } from 'react';
import StudyLogModal from './StudyLogModal';

type StudyLog = {
  id: string;
  subject: string;
  hours: number;
  details: string | null;
  log_date: string;
};

export default function StudyLogList({ logs }: { logs: StudyLog[] }) {
  const [selectedLog, setSelectedLog] = useState<StudyLog | null>(null);

  return (
    <>
      <div className="card-container">
        <h2 className="text-xl font-semibold text-white mb-6">Learning Timeline</h2>
        <div className="relative pl-6 border-l-2 border-neutral-700/50 space-y-8">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="relative cursor-pointer group"
                onClick={() => setSelectedLog(log)}
              >
                <div className="absolute -left-[34px] top-1 h-4 w-4 bg-neutral-700 rounded-full border-4 border-neutral-950 group-hover:bg-cyan-400 transition-colors"></div>
                <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{log.subject}</p>
                <p className="text-sm text-neutral-400">{log.hours} hours</p>
                <p className="text-xs text-neutral-500">{new Date(log.log_date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-4">No study sessions logged.</p>
          )}
        </div>
      </div>
      {selectedLog && (
        <StudyLogModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </>
  );
}
