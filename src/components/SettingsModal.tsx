import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Music, Smartphone, Trash2, Check, AlertTriangle } from 'lucide-react';
import { UserProgress } from '../types/game';

interface SettingsModalProps {
  progress: UserProgress;
  onUpdateSettings: (newSettings: Partial<UserProgress>) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateSettings,
  onResetProgress,
  onBack,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col animate-in fade-in duration-200 text-slate-800">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          aria-label="Geri"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 active:scale-95 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>GERİ</span>
        </button>

        <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
          AYARLAR
        </h1>

        <div className="w-12" />
      </header>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-sm mx-auto w-full flex flex-col gap-4">
        {/* Audio FX Setting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {progress.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Ses Efektleri</span>
              <span className="text-[11px] text-slate-500">Paketler, eşleşmeler ve ziller</span>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ soundEnabled: !progress.soundEnabled })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              progress.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                progress.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Music Setting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Arka Plan Müziği</span>
              <span className="text-[11px] text-slate-500">Rahatlatıcı süpermarket melodisi</span>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ musicEnabled: !progress.musicEnabled })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              progress.musicEnabled ? 'bg-indigo-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                progress.musicEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Vibration Setting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Titreşim</span>
              <span className="text-[11px] text-slate-500">Bırakma ve eşleşme titreşimi</span>
            </div>
          </div>

          <button
            onClick={() => onUpdateSettings({ vibrationEnabled: !progress.vibrationEnabled })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              progress.vibrationEnabled ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                progress.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Progress Section */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-2 text-rose-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-wider">İlerlemeyi Sıfırla</span>
          </div>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-rose-50 active:scale-98 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-300 transition-all shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>TÜM OYUNU SIFIRLA</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-rose-800 font-medium">
                Emin misiniz? Tüm 40 seviye, yıldızlar, rekorlar ve kiler koleksiyonu sıfırlanacaktır!
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>EVET, SIFIRLA</span>
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                >
                  İPTAL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
