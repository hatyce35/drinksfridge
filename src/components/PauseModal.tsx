import React from 'react';
import { Play, RotateCcw, Grid, Home, Volume2, VolumeX, Music } from 'lucide-react';

interface PauseModalProps {
  levelNumber: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  onMainMenu: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelNumber,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onLevelSelect,
  onMainMenu,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-slate-900 border border-sky-400/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-slate-100">
        <h2 className="text-xl font-black text-white tracking-wider uppercase mb-1">
          OYUN DURAKLATILDI
        </h2>
        <p className="text-xs text-cyan-300 mb-6 font-bold">Seviye {levelNumber}</p>

        {/* Audio Toggles */}
        <div className="flex items-center gap-3 w-full justify-center mb-6 p-2 rounded-2xl bg-sky-950/80 border border-sky-400/30">
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundEnabled ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>SES</span>
          </button>
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              musicEnabled ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>MÜZİK</span>
          </button>
        </div>

        {/* Action Buttons - Ice Blue Primary Button */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 border border-cyan-300 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>DEVAM ET</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 border border-sky-400/40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>YENİDEN BAŞLAT</span>
          </button>

          <button
            onClick={onLevelSelect}
            className="w-full py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 border border-sky-400/40 cursor-pointer"
          >
            <Grid className="w-4 h-4 text-cyan-400" />
            <span>SEVİYE SEÇİMİ</span>
          </button>

          <button
            onClick={onMainMenu}
            className="w-full py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 border border-sky-400/40 cursor-pointer"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>ANA MENÜ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
