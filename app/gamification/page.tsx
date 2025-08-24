// in app/gamification/page.tsx
export const revalidate = 0;
import { supabase } from "@/lib/supabaseClient";
import XPBar from "@/components/XPBar";

// Simple leveling formula
const xpToLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
const levelToXP = (level: number) => 100 * Math.pow(level - 1, 2);

export default async function GamificationPage() {
  const placeholderUserId = "00000000-0000-0000-0000-000000000000";
  const { data: profile } = await supabase
    .from("user_profile")
    .select("xp")
    .eq("user_id", placeholderUserId)
    .single();

  const currentXP = profile?.xp || 0;
  const currentLevel = xpToLevel(currentXP);
  const xpForCurrentLevel = levelToXP(currentLevel);
  const xpForNextLevel = levelToXP(currentLevel + 1);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpToLevelUp = xpForNextLevel - xpForCurrentLevel;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Gamification</h1>
      <p className="text-neutral-400">Track your progress and level up your learning.</p>

      <div className="card-container max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-4 rounded-full border-4 border-cyan-400 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{currentLevel}</span>
          </div>
          <h2 className="text-2xl font-semibold text-white">Level {currentLevel}</h2>
          <p className="text-neutral-400 mb-6">{currentXP} Total XP</p>
          <XPBar currentXP={xpInCurrentLevel} xpForNextLevel={xpToLevelUp} />
        </div>
      </div>
    </div>
  );
}