'use client';

import { useTimer } from '@/app/context/TimerContext';
import { Timer, Coffee } from 'lucide-react';

interface Props {
  isExpanded?: boolean;
}

export default function GlobalTimerWidget({ isExpanded = true }: Props) {
  const { mode, timeRemaining, isActive } = useTimer();

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  if (!isActive) return null; // Don't show the widget if the timer isn't running

  return (
    <div className="p-4 border-t border-neutral-800/50">
      <div className="flex items-center justify-center gap-2 text-cyan-400">
        {mode === 'work' ? <Timer size={18} /> : <Coffee size={18} />}
        {isExpanded && (
          <p className="font-mono text-lg">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        )}
        {!isExpanded && (
          <p className="font-mono text-xs">
            {String(minutes).padStart(2, '0')}
          </p>
        )}
      </div>
    </div>
  );
}