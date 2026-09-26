import React from 'react';
import { ArrowLeft, Lock, Star, Trophy } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { UserProgress } from '../types/game';


interface LevelSelectModalProps {
  progress: UserProgress;
  onSelectLevel: (levelNumber: number) => void;
  onBack: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  progress,
  onSelectLevel,
  onBack,
}) => {
  const totalStars = Object.values(progress.starsPerLevel).reduce((acc, s) => acc + s, 0);
  const maxPossibleStars = LEVELS.length * 3;

  const tiers = [
    { title: 'BAŞLANGIÇ DONDURUCUSU', range: [1, 10] },
    { title: 'SOĞUK İÇECEK KATLARI', range: [11, 25] },
    { title: 'DERİN DONDURUCU & KİLİTLER', range: [26, 40] },
    { title: 'MEYVELİ SODA DONDURUCUSU', range: [41, 60] },
    { title: 'KUTUP EFENDİSİ', range: [61, 80] },
    { title: 'EFSANEVİ FRİGO ZİRVESİ', range: [81, 100] },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col animate-in fade-in duration-200 text-slate-100">
      {/* Top Header */}
      <header className="w-full bg-slate-900 border-b border-sky-400/30 px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={onBack}
          aria-label="Menüye Dön"
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-200 hover:text-white px-2.5 py-1.5 rounded-xl bg-sky-950 border border-sky-400/40 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>GERİ</span>
        </button>

        <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
          SEVİYE SEÇİMİ (100 SEVİYE)
        </h1>

        <div className="flex items-center gap-1.5 bg-sky-950 px-2.5 py-1 rounded-xl border border-sky-400/40">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-mono text-xs font-black text-cyan-200 tabular-nums">
            {totalStars}/{maxPossibleStars}
          </span>
        </div>
      </header>

      {/* Levels Scroll Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-md mx-auto w-full">
        {tiers.map((tier, tIdx) => {
          const tierLevels = LEVELS.filter(
            (lvl) => lvl.levelNumber >= tier.range[0] && lvl.levelNumber <= tier.range[1]
          );

          return (
            <div key={tIdx} className="mb-6">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] font-black tracking-wider text-cyan-300 uppercase">
                  {tier.title}
                </span>
                <span className="text-[10px] text-cyan-400/70 font-mono font-bold">
                  Seviye {tier.range[0]}-{tier.range[1]}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {tierLevels.map((lvl) => {
                  const isUnlocked = lvl.levelNumber <= progress.highestLevelUnlocked;
                  const stars = progress.starsPerLevel[lvl.levelNumber] || 0;
                  const highScore = progress.highScores[lvl.levelNumber];
                  const isCurrent = lvl.levelNumber === progress.currentLevel;

                  return (
                    <button
                      key={lvl.levelNumber}
                      disabled={!isUnlocked}
                      onClick={() => {
                        if (isUnlocked) {
                          onSelectLevel(lvl.levelNumber);
                        }
                      }}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-between p-2 border transition-all cursor-pointer ${
                        !isUnlocked
                          ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 border-cyan-300 text-white shadow-lg shadow-cyan-500/30 scale-[1.03]'
                          : 'bg-sky-950/80 hover:bg-sky-900 border-sky-400/30 text-cyan-100 shadow-xs active:scale-95'
                      }`}
                    >
                      {/* Top indicator: High score icon or lock */}
                      <div className="w-full flex items-center justify-between">
                        {!isUnlocked ? (
                          <Lock className="w-3 h-3 text-slate-600 ml-auto" />
                        ) : highScore ? (
                          <Trophy className="w-2.5 h-2.5 text-amber-400" />
                        ) : (
                          <div />
                        )}
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        )}
                      </div>

                      {/* Level Number */}
                      <span className="font-black text-sm sm:text-base leading-none">
                        {lvl.levelNumber}
                      </span>

                      {/* Stars Earned */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-2 h-2 ${
                              stars >= s
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
