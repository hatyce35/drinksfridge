import React from 'react';
import { RotateCcw, Grid, Home, AlertCircle } from 'lucide-react';

interface LevelFailedModalProps {
  levelNumber: number;
  score: number;
  remainingProductsCount: number;
  onRetry: () => void;
  onLevelSelect: () => void;
  onMainMenu: () => void;
}

export const LevelFailedModal: React.FC<LevelFailedModalProps> = ({
  levelNumber,
  score,
  remainingProductsCount,
  onRetry,
  onLevelSelect,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-sky-400/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-slate-100">
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 mb-3 shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-1">
          SEVİYE BAŞARISIZ
        </h2>
        <p className="text-xs text-rose-300 mb-4 font-bold">
          Hamleler tükendi! Rafta {remainingProductsCount} içecek kaldı.
        </p>

        {/* Current Score */}
        <div className="w-full bg-sky-950/80 rounded-2xl p-3 mb-5 border border-sky-400/40 flex items-center justify-between text-xs text-cyan-200 font-bold shadow-inner">
          <span>Kazanılan Puan</span>
          <span className="font-mono text-base font-black text-white tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Ice Blue RETRY Button */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 border-2 border-cyan-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 fill-white" />
            <span>TEKRAR DENE</span>
          </button>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={onLevelSelect}
              className="py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-400/40 cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span>SEVİYELER</span>
            </button>

            <button
              onClick={onMainMenu}
              className="py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-400/40 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>ANA MENÜ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
