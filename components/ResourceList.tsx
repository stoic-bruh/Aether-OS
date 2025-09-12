'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Resource } from '@/lib/types';
import { Link2, FileText, Edit, Trash2, Save, ChevronDown, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ImageChatModal from './ImageChatModal';

// --- Custom Confirmation Modal Component (Built-in) ---
const ConfirmationDialog = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
  <AnimatePresence>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onCancel}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card-container w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-white">Are you sure?</h2>
        <p className="text-neutral-400 mt-2 mb-6">This action is permanent and cannot be undone.</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button onClick={onConfirm} className="btn bg-red-600 text-white hover:bg-red-700">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// --- Individual Resource Item Component (Built-in) ---
function ResourceItem({ item }: { item: Resource }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageChat, setShowImageChat] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/resources/${item.id}`, { method: 'DELETE' });
    setShowDeleteConfirm(false);
    router.refresh();
  };

  const handleSave = async () => {
    if (!editedTitle.trim() || editedTitle === item.title) {
      setIsEditing(false);
      return;
    }
    await fetch(`/api/resources/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editedTitle }),
    });
    setIsEditing(false);
    router.refresh();
  };

  const isImage = item.type === 'Image';

  return (
    <>
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg">
        <div className="flex items-center gap-4 p-4">
          {isImage && item.url ? <img src={item.url} alt={item.title} className="w-10 h-10 object-cover rounded-md flex-shrink-0" /> : (item.url ? <Link2 className="text-cyan-400 flex-shrink-0" /> : <FileText className="text-purple-400 flex-shrink-0" />)}
          <div className="flex-grow min-w-0">
            {isEditing ? (
              <input 
                type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()} onBlur={handleSave}
                className="input-field p-1" autoFocus
              />
            ) : (
              <p className="font-medium text-neutral-200 truncate">{item.title}</p>
            )}
            <p className="text-xs text-neutral-500">{item.type}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {isImage && item.url && (
              <button onClick={() => setShowImageChat(true)} className="btn-ghost p-2 text-cyan-400/70 hover:text-cyan-400" title="Chat with this image">
                <MessageSquare size={16} />
              </button>
            )}
            {isEditing ? (
               <button onClick={handleSave} className="btn-ghost p-2" title="Save"><Save size={16} /></button>
            ) : (
               <button onClick={() => setIsEditing(true)} className="btn-ghost p-2" title="Edit"><Edit size={16} /></button>
            )}
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-ghost p-2 text-red-500/70 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
            {item.content && !isImage && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="btn-ghost p-2" title="Expand">
                <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && item.content && !isImage && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-neutral-800">
                <p className="text-neutral-300 whitespace-pre-wrap break-words">{item.content}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showDeleteConfirm && (
        <ConfirmationDialog onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />
      )}
      {showImageChat && item.url && (
        <ImageChatModal imageUrl={item.url} onClose={() => setShowImageChat(false)} />
      )}
    </>
  );
}

// --- Main ResourceList Component ---
export default function ResourceList({ resources }: { resources: Resource[] }) {
  const groupedResources = resources.reduce((acc, resource) => {
    const key = resource.subject || 'Uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedResources).map(([subject, items]) => (
        <div key={subject} className="card-container">
          <h2 className="text-xl font-semibold text-white mb-4">{subject}</h2>
          <div className="space-y-3">
            {items.map(item => <ResourceItem key={item.id} item={item} />)}
          </div>
        </div>
      ))}
      {resources.length === 0 && (
        <p className="text-neutral-500 text-center py-8">No resources saved yet.</p>
      )}
    </div>
  );
}

