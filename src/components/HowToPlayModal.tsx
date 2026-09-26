import React from 'react';
import { ArrowLeft, Sparkles, MoveHorizontal, Eye, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  onBack: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onBack }) => {
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
          NASIL OYNANIR?
        </h1>

        <div className="w-12" />
      </header>

      {/* Guide Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-sm mx-auto w-full flex flex-col gap-4 text-left">
        {/* Step 1: Arrange & Move */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600">
            <MoveHorizontal className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wide">1. Boş Raf Alanlarına Taşı</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Öndeki teneke kutuya dokunup parmağınızla sürükleyin ya da seçip herhangi bir <span className="text-amber-800 font-bold">[BOŞ RAF]</span> alanına bırakın!
          </p>
        </div>

        {/* Step 2: Match 3 Identical */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wide">2. Aynı 3 Teneke Kutuyu Yan Yana Getir</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Aynı içecek tenekesinden 3 tanesini bir bölmeye topladığınızda otomatik olarak <span className="text-emerald-700 font-bold">EŞLEŞİR</span> ve raftan kaybolur!
          </p>
          <div className="text-[11px] text-slate-700 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            ★ Bir satırdaki tüm raflar boşaltıldığında büyük satır bonusu kazanılır!
          </div>
        </div>

        {/* Step 3: Hidden Rear Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600">
            <Eye className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wide">3. Arkadaki Kutuları Aç</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Köşesinde (+1, +2) rozeti olan kutuların arkasında istiflenmiş diğer tenekeler vardır! Öndeki kutu taşındığında arkadaki kutu öne kayar!
          </p>
        </div>

        {/* Step 4: Special Items */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600">
            <Zap className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wide">4. Özel Teneke Kutular</h3>
          </div>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 font-medium">
            <li><span className="font-bold text-amber-800">Kilitli Kutular</span>: Rafta başka bir eşleşme yapılana kadar kilitli kalır.</li>
            <li><span className="font-bold text-cyan-800">Buzlu Kutular</span>: Eşleştirildiğinde buz kırılarak çözülür!</li>
            <li><span className="font-bold text-emerald-800">Bonus Kutular</span>: Eşleştiğinde +5 ekstra hamle verir!</li>
            <li><span className="font-bold text-pink-800">Joker Yıldız Kutusu</span>: Herhangi iki aynı kutuyu tamamlar!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
