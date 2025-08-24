'use client';
import { useTimer } from '@/app/context/TimerContext';
import { Timer } from 'lucide-react';

export default function GlobalTimerWidget() {
  const { timeRemaining, isActive, mode } = useTimer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Don't show the widget if the timer has never been started
  if (!isActive && timeRemaining === 25 * 60) {
    return null;
  }

  return (
    <div className="p-4 border-t border-neutral-800/50">
      <div className="flex items-center justify-center gap-2">
        <Timer className={`h-5 w-5 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-neutral-500'}`} />
        <span className="font-mono text-lg text-white">{formatTime(timeRemaining)}</span>
        <span className={`text-xs uppercase px-2 py-1 rounded ${mode === 'work' ? 'bg-red-500/50' : 'bg-green-500/50'}`}>
          {mode}
        </span>
      </div>
    </div>
  );
}
