'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BrainDump() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setMessage('');
    
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    setIsLoading(false);
    if (response.ok) {
      setContent('');
      setMessage('Saved to Quick Notes!');
      // We can optionally refresh other pages if needed, but for now, just give feedback.
      // router.refresh(); 
    } else {
      setMessage('Failed to save note.');
    }
  };

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold mb-4 text-white">Brain Dump</h2>
      <p className="text-sm text-neutral-400 mb-4">A distraction-free space to write. Your entry will be saved to your Quick Notes.</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="input-field"
        rows={10}
        disabled={isLoading}
      />
      <div className="flex justify-end items-center mt-4">
        <span className="text-sm text-neutral-500 mr-4">{message}</span>
        <button onClick={handleSave} className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save to Notes'}
        </button>
      </div>
    </div>
  );
}
