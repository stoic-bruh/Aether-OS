'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10); // Update every 10ms for smooth display
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleToggle = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0');
  const milliseconds = String(Math.floor((time / 10) % 100)).padStart(2, '0');

  return (
    <div className="card-container flex flex-col items-center justify-center p-8">
      <div className="font-mono text-5xl md:text-6xl font-bold text-white mb-6">
        <span>{minutes}</span>:
        <span>{seconds}</span>.
        <span className="text-3xl text-neutral-400">{milliseconds}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleReset} className="btn-ghost p-3 rounded-full">
          <RefreshCw size={24} />
        </button>
        <button onClick={handleToggle} className="btn-primary px-8 py-3 rounded-full flex items-center gap-2 text-lg">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
      </div>
    </div>
  );
}
