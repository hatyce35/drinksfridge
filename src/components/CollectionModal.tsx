import React, { useState } from 'react';
import { ArrowLeft, Lock, Sparkles, X, Flame } from 'lucide-react';
import { PRODUCT_LIST, CATEGORIES } from '../data/products';
import { ProductCategory, ProductDefinition } from '../types/game';
import { ProductPackage } from './ProductPackage';

interface CollectionModalProps {
  unlockedProductIds: string[];
  onBack: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  unlockedProductIds,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'Tümü'>('Tümü');
  const [selectedProduct, setSelectedProduct] = useState<ProductDefinition | null>(null);

  const unlockedSet = new Set(unlockedProductIds);

  const filteredProducts = PRODUCT_LIST.filter((p) => {
    if (activeCategory === 'Tümü') return true;
    return p.category === activeCategory;
  });

  const totalUnlocked = PRODUCT_LIST.filter((p) => unlockedSet.has(p.id)).length;

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col animate-in fade-in duration-200 text-slate-800">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          aria-label="Geri"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>GERİ</span>
        </button>

        <h1 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
          İÇECEK DOLABI
        </h1>

        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono text-xs font-black text-slate-900 tabular-nums">
            {totalUnlocked}/{PRODUCT_LIST.length}
          </span>
        </div>
      </header>

      {/* Category Filter Tabs */}
      <div className="w-full bg-white border-b border-slate-200 px-3 py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar shadow-2xs">
        <button
          onClick={() => setActiveCategory('Tümü')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'Tümü'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          Tüm İçecekler ({PRODUCT_LIST.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-md mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredProducts.map((product) => {
            const isUnlocked = unlockedSet.has(product.id);

            return (
              <div
                key={product.id}
                onClick={() => isUnlocked && setSelectedProduct(product)}
                className={`relative rounded-2xl p-3 border flex flex-col items-center justify-between text-center transition-all ${
                  isUnlocked
                    ? 'bg-white hover:bg-amber-50/50 border-slate-200 cursor-pointer active:scale-95 shadow-xs'
                    : 'bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Product Beverage Can Display */}
                <div className="h-28 sm:h-32 flex items-center justify-center relative my-1">
                  {isUnlocked ? (
                    <ProductPackage
                      product={{ instanceId: product.id, productId: product.id }}
                      size="normal"
                    />
                  ) : (
                    <div className="w-16 h-24 rounded-t-xl rounded-b-lg bg-slate-300 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center gap-1 p-2 text-slate-500">
                      <Lock className="w-5 h-5 text-slate-400" />
                      <span className="text-[9px] font-black tracking-wider uppercase">KİLİTLİ</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 w-full">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide block">
                    {product.badge}
                  </span>
                  <h3 className="text-xs font-black text-slate-900 truncate">
                    {isUnlocked ? product.name : '???'}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full border border-slate-200 shadow-2xl flex flex-col items-center text-center relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="my-2">
              <ProductPackage
                product={{ instanceId: selectedProduct.id, productId: selectedProduct.id }}
                size="large"
              />
            </div>

            <div className="mt-2 w-full">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                {selectedProduct.badge}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1.5">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-amber-700 font-bold italic mb-3">
                "{selectedProduct.slogan}"
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Aroma:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.flavor}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Kalori:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {selectedProduct.calories}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 leading-relaxed font-normal">
                  {selectedProduct.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
