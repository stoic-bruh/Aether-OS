// in app/components/MotivationCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react'; // Icon

export default function MotivationCard() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/ai/motivation');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage('Unable to retrieve AI uplink. Maintain current trajectory.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Sparkles className="text-cyan-400" />
        Daily Directive
      </h2>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-neutral-800 rounded-md animate-pulse"></div>
          <div className="h-4 w-1/2 bg-neutral-800 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <p className="text-neutral-300 italic">"{message}"</p>
      )}
    </div>
  );
}