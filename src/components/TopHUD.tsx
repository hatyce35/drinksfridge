import React, { useState, useEffect } from 'react';
import { Pause, Star, Volume2, VolumeX, Snowflake, Clock, Maximize, Minimize } from 'lucide-react';
import { toggleFullscreenMode, isFullscreenActive } from '../utils/fullscreen';

interface TopHUDProps {
  levelNumber: number;
  levelTitle: string;
  score: number;
  movesLeft: number | null;
  timeRemaining?: number;
  isTimeFrozen?: boolean;
  freezeSecondsRemaining?: number;
  stars: number;
  starThresholds: [number, number, number];
  remainingProductsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPause: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  levelNumber,
  levelTitle,
  score,
  movesLeft,
  timeRemaining = 90,
  isTimeFrozen = false,
  freezeSecondsRemaining = 0,
  stars,
  starThresholds,
  remainingProductsCount,
  soundEnabled,
  onToggleSound,
  onPause,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(isFullscreenActive());
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    document.addEventListener('webkitfullscreenchange', handleFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange);
      document.removeEventListener('webkitfullscreenchange', handleFSChange);
    };
  }, []);

  const handleToggleFS = async () => {
    const active = await toggleFullscreenMode();
    setIsFullscreen(active);
  };

  const progressPercent = Math.min(100, Math.round((score / starThresholds[2]) * 100));

  // Format time mm:ss
  const mins = Math.floor(Math.max(0, timeRemaining) / 60);
  const secs = Math.max(0, timeRemaining) % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isWarningTime = timeRemaining <= 15 && !isTimeFrozen;

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-sky-400/30 text-slate-100 px-3 py-2.5 flex flex-col gap-1.5 select-none z-30 shadow-md">
      {/* Top Bar: Level, Title, Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Buz Mavisi Level Badge */}
          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white text-xs font-black tracking-wide shadow-md border border-cyan-300/80">
            SEVİYE {levelNumber}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-cyan-100 truncate max-w-[120px] sm:max-w-[180px]">
              {levelTitle}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-cyan-300/80 font-semibold">
              <Snowflake className="w-3 h-3 text-cyan-400" />
              <span>{remainingProductsCount} içecek kaldı</span>
            </div>
          </div>
        </div>

        {/* Action Controls - Buz Mavisi */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleFS}
            aria-label="Tam Ekran Modu"
            title="Tam Ekran"
            className="w-8 h-8 rounded-xl bg-sky-950/80 hover:bg-sky-900 active:scale-95 text-cyan-300 flex items-center justify-center transition-all border border-sky-400/40 shadow-xs cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-cyan-300" />
            ) : (
              <Maximize className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          <button
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="w-8 h-8 rounded-xl bg-sky-950/80 hover:bg-sky-900 active:scale-95 text-cyan-300 flex items-center justify-center transition-all border border-sky-400/40 shadow-xs cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onPause}
            aria-label="Pause Game"
            className="w-8 h-8 rounded-xl bg-sky-950/80 hover:bg-sky-900 active:scale-95 text-cyan-300 flex items-center justify-center transition-all border border-sky-400/40 shadow-xs cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Stat Zone: Score, Countdown Timer, Moves */}
      <div className="grid grid-cols-3 items-center gap-2 pt-0.5">
        {/* Score & Star Progress */}
        <div className="flex flex-col bg-sky-950/80 px-2 py-1.5 rounded-xl border border-sky-400/40 shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-cyan-300/80 font-bold">
            <span>PUAN</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  className={`w-2.5 h-2.5 ${
                    stars >= starNum
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="font-mono text-sm sm:text-base font-black text-cyan-100 tabular-nums">
            {score.toLocaleString()}
          </div>
        </div>

        {/* COUNTDOWN TIMER BADGE */}
        <div
          className={`flex flex-col items-center px-2 py-1.5 rounded-xl border transition-all ${
            isTimeFrozen
              ? 'bg-cyan-900/90 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse'
              : isWarningTime
              ? 'bg-rose-950/90 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse'
              : 'bg-sky-950/80 border-sky-400/40 shadow-inner'
          }`}
        >
          <div className="flex items-center gap-1 text-[10px] font-bold">
            {isTimeFrozen ? (
              <span className="text-cyan-300 flex items-center gap-0.5">
                <Snowflake className="w-2.5 h-2.5 animate-spin" /> DONDURULDU ({freezeSecondsRemaining}s)
              </span>
            ) : (
              <span className={isWarningTime ? 'text-rose-400 animate-bounce' : 'text-cyan-300/80'}>
                <Clock className="w-2.5 h-2.5 inline mr-0.5" /> SÜRE
              </span>
            )}
          </div>
          <div
            className={`font-mono text-sm sm:text-base font-black tabular-nums ${
              isTimeFrozen
                ? 'text-cyan-200'
                : isWarningTime
                ? 'text-rose-400'
                : 'text-emerald-300'
            }`}
          >
            {timeFormatted}
          </div>
        </div>

        {/* Moves Left */}
        <div className="flex flex-col items-center bg-sky-950/80 px-2 py-1.5 rounded-xl border border-sky-400/40 shadow-inner">
          <span className="text-[10px] text-cyan-300/80 font-bold">HAMLE</span>
          <div
            className={`font-mono text-sm sm:text-base font-black tabular-nums ${
              movesLeft !== null && movesLeft <= 5
                ? 'text-rose-400 animate-bounce'
                : 'text-amber-300'
            }`}
          >
            {movesLeft === null ? '∞' : movesLeft}
          </div>
        </div>
      </div>
    </header>
  );
};
