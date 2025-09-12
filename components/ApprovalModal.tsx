'use client';
import { motion } from 'framer-motion';
import { Check, Edit, X } from 'lucide-react';

type ApprovalProps = {
  suggestion: { action: string; payload: string };
  onConfirm: () => void;
  onCancel: () => void;
  // We can add an onEdit function later
};

export default function ApprovalModal({ suggestion, onConfirm, onCancel }: ApprovalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="card-container w-full max-w-lg"
      >
        <h2 className="text-xl font-bold text-white">AI Suggestion</h2>
        <p className="text-neutral-400 mt-2">AetherOS has analyzed your content and suggests the following action:</p>
        
        <div className="my-6 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
          <p className="text-xs font-bold uppercase text-cyan-400">{suggestion.action.replace('_', ' ')}</p>
          <p className="text-white mt-1">"{suggestion.payload}"</p>
        </div>
        
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="btn-ghost">
            <X className="mr-2 h-4 w-4" /> Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary">
            <Check className="mr-2 h-4 w-4" /> Approve & Execute
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
