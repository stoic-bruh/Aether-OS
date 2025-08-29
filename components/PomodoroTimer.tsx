'use client';
import { useTimer } from '@/app/context/TimerContext';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function PomodoroTimer() {
  const { mode, timeRemaining, isActive, toggleTimer, resetTimer } = useTimer();

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="card-container flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <div className={`mb-4 px-4 py-1 rounded-full text-sm font-semibold ${mode === 'work' ? 'bg-cyan-500/10 text-cyan-300' : 'bg-green-500/10 text-green-300'}`}>
        {mode === 'work' ? 'FOCUS' : 'BREAK'}
      </div>
      <div className="font-mono text-7xl md:text-8xl font-bold text-white mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={resetTimer} className="btn-ghost p-3 rounded-full">
          <RefreshCw size={24} />
        </button>
        <button onClick={toggleTimer} className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 text-lg">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
      </div>
    </div>
  );
}
