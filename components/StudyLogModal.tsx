// in app/components/StudyLogModal.tsx
'use client';

type StudyLog = {
  id: string;
  subject: string;
  hours: number;
  details: string | null;
  log_date: string;
};

type ModalProps = {
  log: StudyLog;
  onClose: () => void;
};

export default function StudyLogModal({ log, onClose }: ModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 p-8 rounded-xl w-full max-w-2xl border border-neutral-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">{log.subject}</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Logged {log.hours} hours on {new Date(log.log_date).toLocaleDateString()}
        </p>
        <div className="text-neutral-300 whitespace-pre-wrap break-words mb-6 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          {log.details || "No details were added for this session."}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    </div>
  );
}