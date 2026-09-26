import React, { useEffect, useState, useRef } from 'react';
import { audio } from '../utils/audio';

interface FridgeDoorCloseAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

export const FridgeDoorCloseAnimation: React.FC<FridgeDoorCloseAnimationProps> = ({
  isActive,
  onComplete,
}) => {
  const [doorPhase, setDoorPhase] = useState<'open' | 'closing' | 'slam' | 'done'>('open');
  const onCompleteRef = useRef(onComplete);
  const hasTriggeredRef = useRef(false);

  // Keep callback ref updated without triggering effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      setDoorPhase('open');
      hasTriggeredRef.current = false;
      return;
    }

    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Step 1: Start closing animation (single door swings smoothly from left to right)
    setDoorPhase('closing');

    // Step 2: At 500ms, door closes completely and sits flush onto the fridge frame
    const slamTimer = setTimeout(() => {
      setDoorPhase('slam');
      audio.playFridgeDoorSlam();
    }, 500);

    // Step 3: Wait exactly 2 full seconds (2000ms) AFTER door is seated (500ms + 2000ms = 2500ms total)
    const completeTimer = setTimeout(() => {
      setDoorPhase('done');
      onCompleteRef.current();
    }, 2500);

    return () => {
      clearTimeout(slamTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive]);

  if (!isActive) return null;

  const isClosedOrSlam = doorPhase === 'slam' || doorPhase === 'done';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs pointer-events-auto overflow-hidden">
      {/* 3D Perspective Container for Smooth Door Closing (Zıplama / Sarsıntı Yoktur) */}
      <div
        className="relative w-full max-w-md h-full max-h-[100dvh] flex items-center justify-center px-3"
        style={{ perspective: '1400px' }}
      >
        {/* Single Full-Height Transparent Glass Refrigerator Door (Soldan Sağa Tam Oturan) */}
        <div
          className={`relative w-full h-[88%] rounded-3xl bg-gradient-to-tr from-sky-400/20 via-slate-100/10 to-cyan-300/20 backdrop-blur-[3px] border-[6px] border-slate-300/90 shadow-[0_0_50px_rgba(103,232,249,0.5)] flex flex-col justify-between p-4 transition-all duration-500 ease-out ${
            doorPhase === 'open'
              ? '-translate-x-full -rotate-y-90 opacity-0'
              : isClosedOrSlam
              ? 'translate-x-0 rotate-y-0 opacity-100'
              : '-translate-x-4 -rotate-y-12 opacity-95'
          }`}
          style={{ transformOrigin: 'left center' }}
        >
          {/* Black Rubber Magnetic Door Gasket Seal Frame */}
          <div className="absolute inset-0 rounded-2xl border-4 border-slate-900/60 pointer-events-none" />

          {/* Diagonal Glass Reflection Glare */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-cyan-100/5 to-transparent pointer-events-none" />

          {/* Vertical Chrome Door Handle on the RIGHT side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-56 bg-gradient-to-r from-slate-200 via-white to-slate-400 rounded-xl border border-slate-400 shadow-2xl flex items-center justify-center z-20">
            <div className="w-1.5 h-48 bg-slate-400/60 rounded-full" />
            {/* Handle Grip Detail */}
            <div className="absolute -left-3 top-4 w-3 h-2 bg-slate-400 rounded-l" />
            <div className="absolute -left-3 bottom-4 w-3 h-2 bg-slate-400 rounded-l" />
          </div>

          {/* Top Glass Header Badge */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 bg-sky-950/80 px-3 py-1 rounded-full border border-cyan-400/50 shadow">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-black text-cyan-200 tracking-wider">
                TRANSPARENT COOLER
              </span>
            </div>
            <div className="text-xs font-mono font-black text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-sky-400/40">
              -18°C / 3°C
            </div>
          </div>

          {/* Center Lock / Level Complete Glass Reflection Badge */}
          <div className="w-full flex flex-col items-center justify-center z-10 py-6 my-auto">
            {isClosedOrSlam && (
              <div className="bg-slate-900/90 border-2 border-cyan-300 rounded-2xl px-6 py-4 shadow-[0_0_35px_rgba(34,211,238,0.8)] text-center animate-pulse">
                <div className="text-4xl mb-1">🧊</div>
                <div className="text-sm font-black text-cyan-300 tracking-widest uppercase">
                  BUZDOLABI KAPANDI
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                  TÜM İÇECEKLER SOĞUMAYA ALINDI ✓
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stainless Steel Frost Edge */}
          <div className="w-full flex items-center justify-center z-10 text-[9px] font-mono font-bold text-sky-200/80 bg-slate-900/70 py-1 rounded-xl border border-sky-400/30">
            DRINKS FRIDGE • SMART TEMPERATURE LOCK
          </div>
        </div>
      </div>
    </div>
  );
};
