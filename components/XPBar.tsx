// in app/components/XPBar.tsx
'use client';

type XPBarProps = {
  currentXP: number;
  xpForNextLevel: number;
};

export default function XPBar({ currentXP, xpForNextLevel }: XPBarProps) {
  const progressPercentage = (currentXP / xpForNextLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-neutral-400">
        <span>Progress</span>
        <span>{currentXP} / {xpForNextLevel} XP</span>
      </div>
      <div className="w-full bg-neutral-800 rounded-full h-4 border border-neutral-700">
        <div 
          className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}