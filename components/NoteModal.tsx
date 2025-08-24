// in app/components/NoteModal.tsx
'use client';

type Note = {
  id: string;
  content: string;
  created_at: string;
};

type NoteModalProps = {
  note: Note;
  onClose: () => void;
};

export default function NoteModal({ note, onClose }: NoteModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900 p-8 rounded-xl w-full max-w-xl border border-neutral-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Add break-words to this paragraph tag */}
         <p className="text-neutral-300 whitespace-pre-wrap break-words mb-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
      {note.content}
    </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-neutral-500">
            Created: {new Date(note.created_at).toLocaleString()}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-neutral-700 text-white font-semibold rounded-lg hover:bg-neutral-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}