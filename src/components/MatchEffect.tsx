import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MatchResult } from '../types/game';

interface MatchEffectProps {
  activeMatch: MatchResult | null;
  onComplete: () => void;
}

export const MatchEffect: React.FC<MatchEffectProps> = ({ activeMatch, onComplete }) => {
  useEffect(() => {
    if (!activeMatch) return;

    // ONLY explode confetti when an entire row has been completed/cleared!
    if (activeMatch.isRowCleared) {
      try {
        const colors = ['#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981'];
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors,
          ticks: 140,
          gravity: 1.0,
          scalar: 0.9,
          disableForReducedMotion: true,
        });
      } catch {}
    }

    const timer = setTimeout(() => {
      onComplete();
    }, activeMatch.isRowCleared ? 700 : 400);

    return () => clearTimeout(timer);
  }, [activeMatch, onComplete]);

  if (!activeMatch) return null;

  // Clean, minimal floating score indicator (NO "Satır tamamlandı" text)
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in-90 duration-150">
      <div className="px-3.5 py-1 rounded-full bg-slate-900/90 text-amber-300 font-black text-sm sm:text-base shadow-lg border border-amber-400/50 flex items-center gap-1">
        <span>+{activeMatch.scoreAwarded}</span>
      </div>
    </div>
  );
};
