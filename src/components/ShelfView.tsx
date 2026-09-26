import React from 'react';
import { ShelfSlot, ProductInstance } from '../types/game';
import { ProductPackage } from './ProductPackage';

interface ShelfViewProps {
  compartmentIndex: number;
  slots: ShelfSlot[];
  selectedSlot: { shelfIndex: number; slotIndex: number } | null;
  draggedSlot: { shelfIndex: number; slotIndex: number } | null;
  hintedSlot: { shelfIndex: number; slotIndex: number } | null;
  targetDropSlot: { shelfIndex: number; slotIndex: number } | null;
  onSlotClick: (shelfIndex: number, slotIndex: number) => void;
  onPointerDownSlot: (e: React.PointerEvent, shelfIndex: number, slotIndex: number) => void;
}

export const ShelfView: React.FC<ShelfViewProps> = ({
  compartmentIndex,
  slots,
  selectedSlot,
  draggedSlot,
  hintedSlot,
  targetDropSlot,
  onSlotClick,
  onPointerDownSlot,
}) => {
  return (
    <div className="relative flex-1 min-w-0 w-full max-w-[150px] bg-slate-900/20 backdrop-blur-xs rounded-xl sm:rounded-2xl p-0.5 sm:p-1 pb-0 border border-sky-200/50 shadow-inner flex flex-col items-center justify-between overflow-hidden">
      {/* 3 Dedicated Beverage Can Slots in this Fridge Compartment */}
      <div className="w-full grid grid-cols-3 gap-0.5 sm:gap-1 pt-0.5 pb-1 items-end justify-items-center min-h-[50px] sm:min-h-[75px]">
        {slots.slice(0, 3).map((slot) => {
          const isSlotSelected =
            selectedSlot?.shelfIndex === compartmentIndex && selectedSlot?.slotIndex === slot.slotIndex;
          const isSlotDragged =
            draggedSlot?.shelfIndex === compartmentIndex && draggedSlot?.slotIndex === slot.slotIndex;
          const isSlotHinted =
            hintedSlot?.shelfIndex === compartmentIndex && hintedSlot?.slotIndex === slot.slotIndex;
          const isTargetDrop =
            targetDropSlot?.shelfIndex === compartmentIndex && targetDropSlot?.slotIndex === slot.slotIndex;

          const frontProduct: ProductInstance | undefined = slot.stack[0];
          const hiddenCount = Math.max(0, slot.stack.length - 1);
          const isEmpty = slot.stack.length === 0;

          return (
            <div
              key={`slot-${compartmentIndex}-${slot.slotIndex}`}
              id={`shelf-slot-${compartmentIndex}-${slot.slotIndex}`}
              data-shelf={compartmentIndex}
              data-slot={slot.slotIndex}
              onPointerDown={(e) => onPointerDownSlot(e, compartmentIndex, slot.slotIndex)}
              onClick={() => onSlotClick(compartmentIndex, slot.slotIndex)}
              className={`relative flex items-end justify-center w-full h-13 sm:h-17 md:h-19 cursor-pointer transition-all duration-150 rounded-md sm:rounded-xl p-0.5 ${
                isEmpty
                  ? isTargetDrop
                    ? 'border-2 border-amber-400 bg-amber-100/90 ring-2 sm:ring-4 ring-amber-300 scale-[1.03] shadow-[0_0_20px_rgba(251,191,36,0.95)] animate-pulse'
                    : selectedSlot
                    ? 'border border-dashed border-amber-300 bg-amber-50/80 scale-[1.01]'
                    : 'border border-sky-200/40 bg-sky-50/20 shadow-inner'
                  : 'border border-sky-200/30 bg-sky-50/10'
              } ${isSlotSelected && !isSlotDragged ? 'ring-2 ring-amber-400 bg-amber-100/60' : ''} ${
                isSlotDragged ? 'opacity-30 scale-95 ring-2 ring-dashed ring-amber-400' : ''
              }`}
            >
              {isEmpty ? (
                // Clean empty illuminated glass fridge slot
                <div className="w-full h-full rounded-md bg-sky-100/10 border-b border-sky-300/30 pointer-events-none relative flex items-center justify-center">
                  {isTargetDrop && (
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shadow-[0_0_10px_#fbbf24]" />
                  )}
                </div>
              ) : (
                // Cylindrical Beverage Can sitting in fridge slot
                <div className="w-full h-full flex items-end justify-center">
                  <ProductPackage
                    product={frontProduct}
                    hiddenCount={hiddenCount}
                    isSelected={isSlotSelected}
                    isDragging={isSlotDragged}
                    isHinted={isSlotHinted}
                    size="mini"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Refrigerator Tempered Glass Shelf Base with Metallic Front Guard Rail */}
      <div className="w-full h-2 sm:h-2.5 bg-gradient-to-r from-slate-300 via-sky-100 via-slate-100 to-slate-400 rounded-b-md sm:rounded-b-lg border-t border-sky-300/70 shadow-2xs relative flex items-center justify-center">
        {/* Chrome Front Wire Safety Rail */}
        <div className="w-[96%] h-0.5 bg-gradient-to-r from-slate-400 via-white to-slate-400 rounded-full shadow-2xs opacity-80" />
      </div>
    </div>
  );
};
