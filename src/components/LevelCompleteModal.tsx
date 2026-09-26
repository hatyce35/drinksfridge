import React, { useEffect } from 'react';
import { Star, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductPackage } from './ProductPackage';
import { PRODUCTS } from '../data/products';

interface LevelCompleteModalProps {
  levelNumber: number;
  score: number;
  stars: number;
  movesLeftBonus: number;
  isNewHighScore: boolean;
  newUnlockedProductIds: string[];
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onMainMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  score,
  stars,
  movesLeftBonus,
  isNewHighScore,
  newUnlockedProductIds,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onMainMenu,
}) => {
  useEffect(() => {
    // Grand celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.4 },
        colors: ['#06B6D4', '#38BDF8', '#F59E0B', '#3B82F6', '#8B5CF6'],
      });
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-sky-400/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-slate-100">
        {/* Header Badge */}
        <div className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>BUZDOLABI TEMİZLENDİ!</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-3">
          SEVİYE {levelNumber} TAMAMLANDI
        </h2>

        {/* 3-Star Rating Fanfare */}
        <div className="flex items-center justify-center gap-3 my-2">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transition-all transform ${
                starIdx === 2 ? '-translate-y-2' : ''
              } ${
                stars >= starIdx
                  ? 'scale-115 text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.8)]'
                  : 'text-slate-700 scale-95'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  stars >= starIdx ? 'fill-amber-400' : 'fill-slate-700'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Score Card */}
        <div className="w-full bg-sky-950/80 rounded-2xl p-4 my-3 border border-sky-400/40 flex flex-col gap-2 shadow-inner">
          <div className="flex items-center justify-between text-xs text-cyan-200/90 font-bold">
            <span>TOPLAM PUAN</span>
            <span className="font-mono text-xl font-black text-white tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          {movesLeftBonus > 0 && (
            <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold border-t border-sky-400/30 pt-1.5">
              <span>Kalan Hamle Bonusu</span>
              <span className="font-mono tabular-nums">+{movesLeftBonus}</span>
            </div>
          )}

          {isNewHighScore && (
            <div className="bg-amber-400/20 text-amber-300 border border-amber-400/50 rounded-lg py-1 px-2 text-[10px] font-black uppercase tracking-wide">
              ★ YENİ REKOR PUAN! ★
            </div>
          )}
        </div>

        {/* Newly Unlocked Products in Collection */}
        {newUnlockedProductIds.length > 0 && (
          <div className="w-full bg-sky-950/80 border border-sky-400/40 rounded-2xl p-3 my-2 flex flex-col items-center shadow-inner">
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1.5">
              YENİ İÇECEK KİLİDİ AÇILDI!
            </span>
            <div className="flex items-center gap-3">
              {newUnlockedProductIds.map((pId) => {
                const pDef = PRODUCTS[pId];
                if (!pDef) return null;
                return (
                  <div key={pId} className="flex flex-col items-center">
                    <ProductPackage
                      product={{ instanceId: pId, productId: pId }}
                      size="small"
                    />
                    <span className="text-[10px] font-black text-cyan-200 mt-1">
                      {pDef.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons - Ice Blue Next Level */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 border-2 border-cyan-300 cursor-pointer"
            >
              <span>SONRAKİ SEVİYE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onMainMenu}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 active:scale-98 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>100 SEVİYE TAMAMLANDI!</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={onReplay}
              className="py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-400/40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>TEKRAR</span>
            </button>

            <button
              onClick={onMainMenu}
              className="py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 active:scale-98 text-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-400/40 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>MENÜ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
