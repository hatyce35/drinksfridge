import React from 'react';
import { RotateCcw, Snowflake, Hammer, Shuffle, Lightbulb } from 'lucide-react';

interface BottomControlsProps {
  onUndo: () => void;
  canUndo: boolean;
  onFreezeTime: () => void;
  isTimeFrozen: boolean;
  onToggleHammer: () => void;
  isHammerActive: boolean;
  onShuffle: () => void;
  onHint: () => void;
  hintsRemaining: number;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  onUndo,
  canUndo,
  onFreezeTime,
  isTimeFrozen,
  onToggleHammer,
  isHammerActive,
  onShuffle,
  onHint,
  hintsRemaining,
}) => {
  return (
    <footer className="w-full bg-slate-950/95 backdrop-blur-md border-t border-sky-400/30 px-3 py-2.5 flex items-center justify-center gap-2 sm:gap-3 z-30 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3 max-w-sm w-full justify-around">
        {/* 1. UNDO BUTTON (Icon Only) */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Hamle Geri Al"
          title="Hamleyi Geri Al"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
            canUndo
              ? 'bg-sky-900/90 hover:bg-cyan-600 active:scale-95 text-cyan-200 border border-cyan-400/60'
              : 'bg-slate-900/50 text-slate-600 border border-slate-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 2. FREEZE TIME POWER-UP (Icon Only - Kar Tanesi) */}
        <button
          onClick={onFreezeTime}
          disabled={isTimeFrozen}
          aria-label="15s Süreyi Dondur"
          title="15 Saniye Süreyi Dondur"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md relative ${
            isTimeFrozen
              ? 'bg-cyan-500 text-slate-950 border-2 border-cyan-200 ring-4 ring-cyan-400/60 animate-pulse'
              : 'bg-sky-900/90 hover:bg-cyan-600 active:scale-95 text-cyan-200 border border-cyan-400/60'
          }`}
        >
          <Snowflake className={`w-5 h-5 sm:w-6 sm:h-6 ${isTimeFrozen ? 'animate-spin' : ''}`} />
          <div className="absolute -top-1 -right-1 bg-cyan-400 text-slate-950 text-[9px] font-black px-1 rounded-full border border-white shadow-2xs">
            15s
          </div>
        </button>

        {/* 3. HAMMER SMASH POWER-UP (Icon Only - Çekiç) */}
        <button
          onClick={onToggleHammer}
          aria-label="Çekiç İle Kutu Ez"
          title="Çekiç Modu (3 Kutuyu Ez)"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md relative ${
            isHammerActive
              ? 'bg-amber-400 text-slate-950 border-2 border-amber-100 ring-4 ring-amber-400 animate-bounce'
              : 'bg-sky-900/90 hover:bg-amber-500 hover:text-slate-950 active:scale-95 text-cyan-200 border border-cyan-400/60'
          }`}
        >
          <Hammer className="w-5 h-5 sm:w-6 sm:h-6" />
          {isHammerActive && (
            <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1 rounded-full border border-white shadow-2xs">
              AKTİF
            </div>
          )}
        </button>

        {/* 4. SHUFFLE BUTTON (Icon Only) */}
        <button
          onClick={onShuffle}
          aria-label="Rafları Karıştır"
          title="Rafları Karıştır"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-900/90 hover:bg-cyan-600 active:scale-95 text-cyan-200 flex items-center justify-center transition-all border border-cyan-400/60 shadow-md cursor-pointer"
        >
          <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 5. HINT BUTTON (Icon Only - İpucu) */}
        <button
          onClick={onHint}
          aria-label="İpucu Göster"
          title="Eşleşme İpucu"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-900/90 hover:bg-cyan-600 active:scale-95 text-cyan-200 flex items-center justify-center transition-all border border-cyan-400/60 shadow-md cursor-pointer relative"
        >
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
          {hintsRemaining > 0 && (
            <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full border border-white flex items-center justify-center shadow-2xs">
              {hintsRemaining}
            </div>
          )}
        </button>
      </div>
    </footer>
  );
};
