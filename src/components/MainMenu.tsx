import React from 'react';
import { Play, Grid, BookOpen, Settings, Star, Zap, HelpCircle } from 'lucide-react';
import { UserProgress } from '../types/game';
import { LEVELS } from '../data/levels';
import { PRODUCT_LIST } from '../data/products';
import { ProductPackage } from './ProductPackage';


interface MainMenuProps {
  progress: UserProgress;
  onPlay: () => void;
  onOpenLevels: () => void;
  onOpenCollection: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onPlay,
  onOpenLevels,
  onOpenCollection,
  onOpenSettings,
  onOpenHowToPlay,
}) => {
  const handlePlayClick = () => {
    onPlay();
  };
  const totalStars = Object.values(progress.starsPerLevel).reduce((acc, s) => acc + s, 0);
  const maxPossibleStars = LEVELS.length * 3;
  const currentLvl = Math.min(LEVELS.length, progress.currentLevel);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-900 via-sky-950 to-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />

      {/* Top Header stats bar */}
      <header className="relative w-full max-w-sm flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2 bg-sky-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-sky-400/40 shadow-xs">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-mono text-xs font-black text-cyan-200 tabular-nums">
            {totalStars}/{maxPossibleStars}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenHowToPlay}
            aria-label="Nasıl Oynanır"
            className="w-9 h-9 rounded-2xl bg-sky-950/90 backdrop-blur-md border border-sky-400/40 flex items-center justify-center text-cyan-300 hover:text-white active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Ayarlar"
            className="w-9 h-9 rounded-2xl bg-sky-950/90 backdrop-blur-md border border-sky-400/40 flex items-center justify-center text-cyan-300 hover:text-white active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Settings className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </header>

      {/* Hero Branding Section */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto w-full max-w-sm">
        {/* Animated Showcase Mini Refrigerator Shelf Preview */}
        <div className="w-full relative flex flex-col items-center mb-5 bg-gradient-to-b from-slate-900 to-slate-950 p-3 rounded-3xl border-2 border-sky-300/80 shadow-2xl overflow-hidden">
          <div className="text-[10px] font-black text-cyan-300 uppercase tracking-widest mb-2 flex items-center justify-between w-full px-1">
            <span>❄️ DERİN DONDURUCU RAFI</span>
            <span className="text-[9px] text-amber-300 bg-sky-950 border border-sky-400/50 px-2 py-0.5 rounded font-mono font-bold">-18°C</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[270px] mb-2 items-end justify-items-center">
            <ProductPackage
              product={{ instanceId: 'demo-1', productId: 'fizz_up' }}
              hiddenCount={1}
              size="normal"
            />
            <ProductPackage
              product={{ instanceId: 'demo-2', productId: 'berry_pop' }}
              size="normal"
            />
            <ProductPackage
              product={{ instanceId: 'demo-3', productId: 'pop_fizz' }}
              size="normal"
            />
          </div>

          {/* Refrigerator Glass Shelf Ledge */}
          <div className="w-full h-2.5 bg-gradient-to-r from-slate-300 via-sky-100 via-slate-100 to-slate-400 rounded-b-xl border-t border-sky-400/80 shadow-2xs" />
        </div>

        {/* Brand Name Title: DRINKS FRIDGE */}
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-xs">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase drop-shadow-[0_2px_10px_rgba(34,211,238,0.5)]">
            DRINKS FRIDGE
          </h1>
        </div>

        <p className="text-xs text-cyan-200/90 max-w-[280px] leading-relaxed mb-6 font-medium">
          Buzdolabı ve derin dondurucu raflarını düzenle, 3 aynı soğuk içeceği yan yana getir!
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* ICE BLUE PLAY BUTTON */}
          <button
            onClick={handlePlayClick}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-base tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/30 border-2 border-cyan-300 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>SEVİYE {currentLvl} OYNA</span>
          </button>

          {/* SECONDARY ROW: LEVELS & COLLECTION */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              onClick={onOpenLevels}
              className="py-3 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 border border-sky-400/40 shadow-xs transition-all cursor-pointer"
            >
              <Grid className="w-4 h-4 text-cyan-400" />
              <span>SEVİYELER ({progress.highestLevelUnlocked}/100)</span>
            </button>

            <button
              onClick={onOpenCollection}
              className="py-3 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 border border-sky-400/40 shadow-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>DOLAP ({progress.unlockedProductIds.length}/{PRODUCT_LIST.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="relative z-10 text-center py-2">
        <span className="text-[11px] text-cyan-300/70 font-semibold">
          100 Zorlaşan Seviye · Buzdolabı & Derin Dondurucu
        </span>
      </footer>
    </div>
  );
};
