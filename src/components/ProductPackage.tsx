import React from 'react';
import { Lock, Sparkles, Plus, Star } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductInstance } from '../types/game';

interface ProductPackageProps {
  product: ProductInstance;
  hiddenCount?: number;
  isDragging?: boolean;
  isSelected?: boolean;
  isHinted?: boolean;
  size?: 'normal' | 'large' | 'small' | 'mini';
  onClick?: () => void;
}

export const ProductPackage: React.FC<ProductPackageProps> = ({
  product,
  hiddenCount = 0,
  isDragging = false,
  isSelected = false,
  isHinted = false,
  size = 'normal',
  onClick,
}) => {
  const def = PRODUCTS[product.productId] || PRODUCTS.fizz_up;

  // Sizing configurations - tailored specifically for 3D beverage cans
  const dimensions = {
    mini: {
      w: 'w-7.5 sm:w-9.5 md:w-11',
      h: 'h-12.5 sm:h-15.5 md:h-17.5',
      icon: 'text-xs sm:text-base',
      bubble: 'w-5 h-5 sm:w-6.5 sm:h-6.5',
      badgeText: 'text-[5px] sm:text-[6px]',
      badge: 'text-[5px] sm:text-[6px] px-1 py-[0.5px]',
    },
    small: {
      w: 'w-10 sm:w-12',
      h: 'h-16 sm:h-20',
      icon: 'text-base sm:text-xl',
      bubble: 'w-6 h-6 sm:w-8 sm:h-8',
      badgeText: 'text-[6px] sm:text-[7px]',
      badge: 'text-[6px] sm:text-[7px] px-1.5 py-0.2',
    },
    normal: {
      w: 'w-14 sm:w-16',
      h: 'h-22 sm:h-26',
      icon: 'text-2xl sm:text-3xl',
      bubble: 'w-8 h-8 sm:w-10 sm:h-10',
      badgeText: 'text-[8px] sm:text-[9px]',
      badge: 'text-[7px] sm:text-[8px] px-2 py-0.5',
    },
    large: {
      w: 'w-20 sm:w-24',
      h: 'h-[120px] sm:h-[150px]',
      icon: 'text-3xl sm:text-4xl',
      bubble: 'w-11 h-11 sm:w-13 sm:h-13',
      badgeText: 'text-[10px]',
      badge: 'text-[8px] px-2 py-0.5',
    },
  }[size];

  // Pure 3D Aluminum Beverage Can Renderer with NO outer card borders or bleed
  const renderCylindricalCan = () => {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between select-none bg-transparent">
        {/* 1. TOP ALUMINUM LID & PULL-TAB (Gerçek Teneke Kapağı) */}
        <div className="w-[84%] h-[12%] rounded-t-full bg-gradient-to-r from-slate-400 via-slate-100 via-slate-200 to-slate-500 border border-slate-500/80 flex items-center justify-center relative shadow-xs z-20">
          {/* Inner Pull-Tab Lid Oval Depression */}
          <div className="w-[78%] h-[60%] rounded-full bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 border border-slate-500/60 flex items-center justify-center">
            {/* Pull-Tab Ring (Açma Halkası) */}
            <div className="w-2 h-0.5 rounded-full bg-slate-100 border border-slate-400 flex items-center justify-center shadow-2xs">
              <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
            </div>
          </div>
        </div>

        {/* 2. TOP TAPERED ALUMINUM NECK (Teneke Boğazı) */}
        <div className="w-[90%] h-[6%] bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 border-x border-slate-400/80 -mt-[1px] z-10" />

        {/* 3. CYLINDRICAL CAN BODY (Teneke Etiketli Gövde) */}
        <div
          className="relative w-full flex-1 rounded-xs overflow-hidden flex flex-col items-center justify-between py-0.5 px-0.5 border-x border-black/25 shadow-md -mt-[1px] -mb-[1px] z-10"
          style={{
            background: `linear-gradient(135deg, ${def.primaryColor} 0%, ${def.secondaryColor} 100%)`,
          }}
        >
          {/* Curved Specular Reflection Overlay (3D Silindir Işık Yansıması) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-white/35 via-white/10 to-black/35 pointer-events-none z-10" />

          {/* Upper Metallic Brand Collar */}
          <div className="relative z-20 w-full flex items-center justify-center pt-0.2">
            <div className={`rounded-full bg-slate-900/40 backdrop-blur-2xs border border-white/30 text-white font-black tracking-widest uppercase shadow-2xs ${dimensions.badge}`}>
              {def.badge}
            </div>
          </div>

          {/* Central Glass Bubble with Drink Icon */}
          <div className="relative z-20 my-auto flex items-center justify-center">
            <div className={`${dimensions.bubble} rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center shadow-md border border-white/40 group-hover:scale-110 transition-transform`}>
              <span className={`${dimensions.icon} leading-none drop-shadow-md select-none`}>
                {def.icon}
              </span>
            </div>
          </div>

          {/* Bottom Bold Brand Title */}
          <div className="relative z-20 w-full flex flex-col items-center justify-center pb-0.2">
            <span className={`${dimensions.badgeText} font-black text-white tracking-wider uppercase drop-shadow-xs leading-none`}>
              {def.shortName}
            </span>
          </div>

          {/* --- SPECIAL OVERLAYS ON CYLINDER BODY --- */}

          {/* LOCKED */}
          {product.isLocked && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-2xs flex items-center justify-center p-1 border-2 border-amber-400 z-30">
              <div className="p-1 rounded-full bg-amber-400 text-slate-950 shadow-md">
                <Lock className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          )}

          {/* FROZEN */}
          {product.isFrozen && (
            <div className="absolute inset-0 bg-cyan-200/60 backdrop-blur-2xs flex items-center justify-center p-1 border-2 border-cyan-400 shadow-inner z-30">
              <div className="p-1 rounded-full bg-cyan-500 text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* BONUS */}
          {product.isBonus && (
            <div className="absolute top-1 left-1 bg-amber-400 text-slate-950 px-1 py-0.2 rounded-full border border-white text-[7px] font-black flex items-center gap-0.5 shadow-md z-30">
              <Plus className="w-2 h-2 stroke-[3]" />
              <span>5</span>
            </div>
          )}

          {/* WILD */}
          {product.isWild && (
            <div className="absolute top-1 right-1 bg-gradient-to-r from-pink-500 to-amber-400 text-white p-0.5 rounded-full border border-white shadow-md z-30 animate-spin">
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
          )}
        </div>

        {/* 4. BOTTOM TAPERED ALUMINUM BASE (Alt Teneke Taban) */}
        <div className="w-[90%] h-[5%] bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border-x border-slate-500/80 z-10" />
        <div className="w-[84%] h-[9%] rounded-b-lg bg-gradient-to-r from-slate-500 via-slate-100 via-slate-200 to-slate-600 border border-slate-700/80 shadow-xs z-20 -mt-[1px]" />
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative select-none transition-all duration-150 ${dimensions.w} ${dimensions.h} ${
        isDragging ? 'scale-110 z-30 opacity-90 drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]' : isSelected ? 'scale-105 z-20 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]' : 'z-10 drop-shadow-md'
      } ${isHinted ? 'animate-bounce' : ''}`}
      style={{ touchAction: 'none' }}
    >
      {/* 
        STACKED CANS BEHIND:
        Peeking metallic aluminum top lids of stacked rear drink cans (NO outer card boxes)
      */}
      {hiddenCount > 0 && (
        <>
          {hiddenCount >= 2 && (
            <div
              className="absolute -top-3 -right-2 w-[84%] h-[15%] rounded-t-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border border-slate-400 pointer-events-none transform scale-90"
              style={{ zIndex: 0 }}
            />
          )}

          <div
            className="absolute -top-2 -right-1.5 w-[84%] h-[15%] rounded-t-full bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 border border-slate-400 pointer-events-none transform scale-95 flex items-start justify-end p-0.5"
            style={{ zIndex: 1 }}
          >
            {/* Count badge on pull-tab */}
            <div className="flex items-center justify-center px-1.5 py-0.5 bg-slate-900/95 rounded-full text-[8px] font-black text-amber-300 shadow-md border border-amber-300/80 leading-none -mt-2 -mr-1 z-30">
              <span>+{hiddenCount}</span>
            </div>
          </div>
        </>
      )}

      {/* Main Front Cylindrical Beverage Can */}
      <div
        className={`relative w-full h-full bg-transparent transition-all duration-200 ${
          product.isRevealing ? 'animate-in fade-in zoom-in-90 duration-200' : ''
        } ${product.isMatching ? 'scale-0 opacity-0 duration-300 transform' : ''}`}
        style={{ zIndex: 2 }}
      >
        {renderCylindricalCan()}

        {/* Hint highlight contour */}
        {isHinted && (
          <div className="absolute inset-0 rounded-t-xl rounded-b-lg ring-2 ring-amber-400 animate-ping pointer-events-none" />
        )}
      </div>
    </div>
  );
};
