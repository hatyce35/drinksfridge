import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LevelData, ShelfSlot, ProductInstance, MatchResult, UserProgress } from '../types/game';
import { audio } from '../utils/audio';
import { ShelfView } from './ShelfView';
import { ProductPackage } from './ProductPackage';
import { TopHUD } from './TopHUD';
import { BottomControls } from './BottomControls';
import { MatchEffect } from './MatchEffect';
import { PauseModal } from './PauseModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { LevelFailedModal } from './LevelFailedModal';
import { HowToPlayModal } from './HowToPlayModal';
import { FridgeDoorCloseAnimation } from './FridgeDoorCloseAnimation';

interface GameBoardProps {
  level: LevelData;
  progress: UserProgress;
  onLevelComplete: (levelNumber: number, score: number, stars: number, unlockedIds: string[]) => void;
  onLevelSelect: () => void;
  onMainMenu: () => void;
  onUpdateSettings: (newSettings: Partial<UserProgress>) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  progress,
  onLevelComplete,
  onLevelSelect,
  onMainMenu,
  onUpdateSettings,
}) => {
  // Initialize shelves from level configuration
  const initializeBoard = useCallback(() => {
    let instanceCounter = 0;
    const initial: ShelfSlot[][] = level.initialShelves.map((shelf, shelfIdx) =>
      shelf.map((slotConfig, slotIdx) => {
        const stack: ProductInstance[] = [];
        if (slotConfig.productId) {
          instanceCounter++;
          stack.push({
            instanceId: `inst-${level.levelNumber}-${shelfIdx}-${slotIdx}-${instanceCounter}`,
            productId: slotConfig.productId,
            isLocked: slotConfig.isLocked,
            isFrozen: slotConfig.isFrozen,
            isBonus: slotConfig.isBonus,
            isWild: slotConfig.isWild,
          });

          // Push any hidden rear products behind it
          if (slotConfig.hiddenProductIds && slotConfig.hiddenProductIds.length > 0) {
            slotConfig.hiddenProductIds.forEach((hiddenId) => {
              instanceCounter++;
              stack.push({
                instanceId: `inst-${level.levelNumber}-${shelfIdx}-${slotIdx}-${instanceCounter}`,
                productId: hiddenId,
              });
            });
          }
        }
        return {
          shelfIndex: shelfIdx,
          slotIndex: slotIdx,
          stack,
        };
      })
    );
    return initial;
  }, [level]);

  const [shelves, setShelves] = useState<ShelfSlot[][]>(initializeBoard);
  const [movesLeft, setMovesLeft] = useState<number | null>(level.maxMoves);
  const [score, setScore] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<{ shelfIndex: number; slotIndex: number } | null>(null);
  const [draggedSlot, setDraggedSlot] = useState<{ shelfIndex: number; slotIndex: number } | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [targetDropSlot, setTargetDropSlot] = useState<{ shelfIndex: number; slotIndex: number } | null>(null);
  const [hintedSlot, setHintedSlot] = useState<{ shelfIndex: number; slotIndex: number } | null>(null);
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);

  // Countdown Timer & Power-Up States
  const [timeRemaining, setTimeRemaining] = useState<number>(level.timeLimit || 90);
  const [isTimeFrozen, setIsTimeFrozen] = useState<boolean>(false);
  const [freezeSecondsRemaining, setFreezeSecondsRemaining] = useState<number>(0);
  const [isHammerActive, setIsHammerActive] = useState<boolean>(false);
  const [isDoorClosingAnimationActive, setIsDoorClosingAnimationActive] = useState<boolean>(false);

  // Undo History Stack
  const [history, setHistory] = useState<
    { shelves: ShelfSlot[][]; movesLeft: number | null; score: number }[]
  >([]);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [anyMatchMade, setAnyMatchMade] = useState<boolean>(false);
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);
  const [isProcessingMatch, setIsProcessingMatch] = useState<boolean>(false);

  // Drag tracking refs
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartSlotRef = useRef<{ shelfIndex: number; slotIndex: number } | null>(null);
  const hasTriggeredWinRef = useRef<boolean>(false);

  // Audio settings sync
  useEffect(() => {
    audio.setSoundEnabled(progress.soundEnabled);
    audio.setMusicEnabled(progress.musicEnabled);
    audio.setVibrationEnabled(progress.vibrationEnabled);
  }, [progress.soundEnabled, progress.musicEnabled, progress.vibrationEnabled]);

  // Restart level
  const handleRestart = useCallback(() => {
    audio.playTap();
    hasTriggeredWinRef.current = false;
    setIsDoorClosingAnimationActive(false);
    setShelves(initializeBoard());
    setMovesLeft(level.maxMoves);
    setTimeRemaining(level.timeLimit || 90);
    setIsTimeFrozen(false);
    setFreezeSecondsRemaining(0);
    setIsHammerActive(false);
    setScore(0);
    setHistory([]);
    setSelectedSlot(null);
    setDraggedSlot(null);
    setDragPosition(null);
    setTargetDropSlot(null);
    setHintedSlot(null);
    setActiveMatch(null);
    setIsPaused(false);
    setIsComplete(false);
    setIsFailed(false);
    setAnyMatchMade(false);
    setIsProcessingMatch(false);
  }, [initializeBoard, level.maxMoves, level.timeLimit]);

  // Synchronize board when level changes
  useEffect(() => {
    handleRestart();
  }, [level.levelNumber, handleRestart]);

  // Live Countdown Timer Loop
  useEffect(() => {
    if (isPaused || isComplete || isFailed || showHowToPlay) return;

    const timer = setInterval(() => {
      // If Freeze Time is active, countdown freeze duration
      if (isTimeFrozen) {
        setFreezeSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimeFrozen(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Normal time countdown
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsFailed(true);
            audio.playFridgeAlarmBeep();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isComplete, isFailed, showHowToPlay, isTimeFrozen]);

  // Refrigerator Door Open Warning Beep Sound (when time <= 15s)
  useEffect(() => {
    if (isPaused || isComplete || isFailed || showHowToPlay || isTimeFrozen) return;

    if (timeRemaining <= 15 && timeRemaining > 0) {
      audio.playFridgeAlarmBeep();
    }
  }, [timeRemaining, isPaused, isComplete, isFailed, showHowToPlay, isTimeFrozen]);

  // Count total remaining products on board
  const totalProductsRemaining = shelves.reduce(
    (acc, shelf) => acc + shelf.reduce((sAcc, slot) => sAcc + slot.stack.length, 0),
    0
  );

  // Compute current star level (1 to 3) based on score
  const currentStars =
    score >= level.starThresholds[2]
      ? 3
      : score >= level.starThresholds[1]
      ? 2
      : score >= level.starThresholds[0]
      ? 1
      : 0;

  // Save current state to undo history before making a move
  const saveStateToHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-4), // keep last 5 moves max
      {
        shelves: JSON.parse(JSON.stringify(shelves)),
        movesLeft,
        score,
      },
    ]);
  };

  // Undo Last Move
  const handleUndo = () => {
    if (history.length === 0 || isProcessingMatch) return;
    audio.playTap();
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setShelves(last.shelves);
    setMovesLeft(last.movesLeft);
    setScore(last.score);
    setSelectedSlot(null);
  };

  // Freeze Time Power-Up Handler
  const handleFreezeTime = () => {
    if (isTimeFrozen || isPaused || isComplete || isFailed) return;
    setIsTimeFrozen(true);
    setFreezeSecondsRemaining(15);
    audio.playFreezeTime();
  };

  // Hammer Smash Power-Up Mode Toggle
  const handleToggleHammer = () => {
    audio.playTap();
    setIsHammerActive((prev) => !prev);
  };

  // Apply Hammer Smash to Targeted Drink Can (Smashes target + 2 matching cans)
  const handleApplyHammerSmash = (targetShelfIdx: number, targetSlotIdx: number) => {
    const targetSlot = shelves[targetShelfIdx]?.[targetSlotIdx];
    const frontProduct = targetSlot?.stack[0];
    if (!frontProduct) {
      setIsHammerActive(false);
      return;
    }

    const targetProductId = frontProduct.productId;
    audio.playHammerSmash();

    // Find up to 3 slots containing this targeted product at front
    const matchingSlotCoords: { shelfIdx: number; slotIdx: number }[] = [];
    matchingSlotCoords.push({ shelfIdx: targetShelfIdx, slotIdx: targetSlotIdx });

    for (let c = 0; c < shelves.length; c++) {
      for (let s = 0; s < 3; s++) {
        if (matchingSlotCoords.length >= 3) break;
        if (c === targetShelfIdx && s === targetSlotIdx) continue;
        const prod = shelves[c][s].stack[0];
        if (prod && prod.productId === targetProductId) {
          matchingSlotCoords.push({ shelfIdx: c, slotIdx: s });
        }
      }
    }

    // Crush and remove the 3 cans immediately
    const updatedShelves = shelves.map((comp, cIdx) =>
      comp.map((slot, sIdx) => {
        const isMatched = matchingSlotCoords.some((m) => m.shelfIdx === cIdx && m.slotIdx === sIdx);
        if (isMatched && slot.stack.length > 0) {
          const newStack = slot.stack.slice(1);
          if (newStack.length > 0) {
            newStack[0] = { ...newStack[0], isRevealing: true };
          }
          return { ...slot, stack: newStack };
        }
        return slot;
      })
    );

    setShelves(updatedShelves);
    setScore((prev) => prev + 300);
    setIsHammerActive(false);

    // Celebratory Match Banner
    setActiveMatch({
      shelfIndex: targetShelfIdx,
      matchedSlotIndices: [targetSlotIdx],
      productId: targetProductId,
      count: 3,
      comboMultiplier: 1,
      scoreAwarded: 300,
      type: 'SUPER_MATCH',
    });

    // Check if board empty after hammer break
    const isBoardEmptyAfterHammer = updatedShelves.every((comp) =>
      comp.every((s) => s.stack.length === 0)
    );
    if (isBoardEmptyAfterHammer && !hasTriggeredWinRef.current) {
      hasTriggeredWinRef.current = true;
      audio.playWin();
      setIsDoorClosingAnimationActive(true);
    }
  };

  // Check board for 3-in-a-row matches in any compartment
  const checkForMatches = useCallback(
    (currentShelves: ShelfSlot[][]) => {
      for (let sIdx = 0; sIdx < currentShelves.length; sIdx++) {
        const comp = currentShelves[sIdx];
        if (comp.length === 3) {
          const p0 = comp[0].stack[0];
          const p1 = comp[1].stack[0];
          const p2 = comp[2].stack[0];

          if (p0 && p1 && p2) {
            // Standard Match (3 identical products)
            const isStandardMatch =
              p0.productId === p1.productId && p1.productId === p2.productId;

            // Wildcard Match (2 identical + 1 wild)
            const isWildMatch =
              p0.isWild || p1.isWild || p2.isWild;

            if (isStandardMatch || isWildMatch) {
              const matchedProdId = p0.isWild ? p1.productId : p0.productId;

              return {
                shelfIndex: sIdx,
                matchedSlotIndices: [0, 1, 2],
                productId: matchedProdId,
                count: 3,
                comboMultiplier: anyMatchMade ? 2 : 1,
                scoreAwarded: anyMatchMade ? 600 : 300,
                type: anyMatchMade ? 'COMBO' : 'MATCH',
              } as MatchResult;
            }
          }
        }
      }
      return null;
    },
    [anyMatchMade]
  );

  // Process match resolution
  const processMatch = useCallback(
    async (matchResult: MatchResult) => {
      setIsProcessingMatch(true);
      setActiveMatch(matchResult);

      // Sound & vibration
      if (matchResult.type === 'COMBO') {
        audio.playCombo(matchResult.comboMultiplier);
      } else {
        audio.playMatch();
      }

      setScore((prev) => prev + matchResult.scoreAwarded);

      // Track discovered products for catalog unlocks
      if (!progress.unlockedProductIds.includes(matchResult.productId)) {
        setNewlyUnlockedIds((prev) => [...prev, matchResult.productId]);
        onUpdateSettings({
          unlockedProductIds: [...progress.unlockedProductIds, matchResult.productId],
        });
      }

      // Check if any matched item had Bonus (+5 moves)
      const comp = shelves[matchResult.shelfIndex];
      const hasBonusItem = comp.some((slot) => slot.stack[0]?.isBonus);
      if (hasBonusItem && movesLeft !== null) {
        setMovesLeft((prev) => (prev !== null ? prev + 5 : null));
      }

      // Wait 350ms for match pop animation
      await new Promise((res) => setTimeout(res, 350));

      // Remove matched front products from slots & reveal hidden rear items
      let hasRearReveal = false;
      const updatedShelves = shelves.map((c, cIdx) => {
        if (cIdx === matchResult.shelfIndex) {
          return c.map((slot) => {
            const newStack = slot.stack.slice(1);
            if (newStack.length > 0) {
              hasRearReveal = true;
              newStack[0] = { ...newStack[0], isRevealing: true };
            }
            return {
              ...slot,
              stack: newStack,
            };
          });
        }
        return c;
      });

      // Unlock any adjacent locked/frozen items on the board
      let unlockedAny = false;
      updatedShelves.forEach((compartment) => {
        compartment.forEach((slot) => {
          if (slot.stack[0]?.isLocked) {
            slot.stack[0].isLocked = false;
            unlockedAny = true;
          }
          if (slot.stack[0]?.isFrozen) {
            slot.stack[0].isFrozen = false;
            unlockedAny = true;
          }
        });
      });

      if (unlockedAny) {
        audio.playUnlock();
      }

      setShelves(updatedShelves);
      setAnyMatchMade(true);

      // Check if the row containing the matched compartment has now completely cleared of all items
      const matchedComp = matchResult.shelfIndex;
      const rowIndex = Math.floor(matchedComp / 3);
      const rowCompartments = updatedShelves.slice(rowIndex * 3, rowIndex * 3 + 3);
      const remainingInRow = rowCompartments.reduce(
        (acc, comp) => acc + comp.reduce((sub, slot) => sub + slot.stack.length, 0),
        0
      );

      if (remainingInRow === 0) {
        // Whole row cleared! Trigger bonus!
        setActiveMatch({
          ...matchResult,
          isRowCleared: true,
          clearedRowIndex: rowIndex,
          scoreAwarded: matchResult.scoreAwarded + 500,
        });
        setScore((prev) => prev + 500);
        audio.playCombo(3);
      }

      if (hasRearReveal) {
        audio.playReveal();
      }

      setIsProcessingMatch(false);

      // Check victory condition (all shelves completely empty)
      const isBoardEmpty = updatedShelves.every((comp) =>
        comp.every((s) => s.stack.length === 0)
      );

      if (isBoardEmpty && !hasTriggeredWinRef.current) {
        hasTriggeredWinRef.current = true;
        audio.playWin();
        setIsDoorClosingAnimationActive(true);
      }
    },
    [shelves, progress.unlockedProductIds, movesLeft, onUpdateSettings]
  );

  // Trigger match detection whenever shelves state changes
  useEffect(() => {
    if (isProcessingMatch || isComplete || isFailed || isDoorClosingAnimationActive || hasTriggeredWinRef.current) return;
    const match = checkForMatches(shelves);
    if (match) {
      processMatch(match);
    }
  }, [shelves, isProcessingMatch, isComplete, isFailed, isDoorClosingAnimationActive, checkForMatches, processMatch]);

  // Execute item move between slots
  const executeMove = (
    from: { shelfIndex: number; slotIndex: number },
    to: { shelfIndex: number; slotIndex: number }
  ) => {
    if (from.shelfIndex === to.shelfIndex && from.slotIndex === to.slotIndex) return;

    const sourceSlot = shelves[from.shelfIndex][from.slotIndex];
    const targetSlot = shelves[to.shelfIndex][to.slotIndex];

    const sourceItem = sourceSlot.stack[0];
    if (!sourceItem) return;

    // Check if source item is locked or frozen
    if (sourceItem.isLocked || sourceItem.isFrozen) {
      audio.playTap();
      return;
    }

    // Save history for Undo
    saveStateToHistory();

    audio.playDrop();

    // Perform swap or move
    const updatedShelves = shelves.map((comp) => comp.map((s) => ({ ...s, stack: [...s.stack] })));

    if (targetSlot.stack.length === 0) {
      // Move to empty slot
      updatedShelves[to.shelfIndex][to.slotIndex].stack = [sourceItem];
      updatedShelves[from.shelfIndex][from.slotIndex].stack = sourceSlot.stack.slice(1);
    } else {
      // Swap front items between slots
      const targetItem = targetSlot.stack[0];
      if (targetItem.isLocked || targetItem.isFrozen) return;

      updatedShelves[to.shelfIndex][to.slotIndex].stack[0] = sourceItem;
      updatedShelves[from.shelfIndex][from.slotIndex].stack[0] = targetItem;
    }

    setShelves(updatedShelves);

    // Decrement moves counter
    if (movesLeft !== null) {
      const nextMoves = movesLeft - 1;
      setMovesLeft(nextMoves);

      if (nextMoves <= 0) {
        const match = checkForMatches(updatedShelves);
        if (!match) {
          const isBoardEmpty = updatedShelves.every((comp) =>
            comp.every((s) => s.stack.length === 0)
          );
          if (!isBoardEmpty) {
            setTimeout(() => setIsFailed(true), 500);
          }
        }
      }
    }
  };

  // Find nearest empty or target slot for magnetic snap
  const getClosestEmptySlot = (x: number, y: number) => {
    let closestSlot: { shelfIndex: number; slotIndex: number } | null = null;
    let minDistance = 75; // 75px magnetic attraction radius

    for (let c = 0; c < shelves.length; c++) {
      for (let s = 0; s < 3; s++) {
        const el = document.getElementById(`shelf-slot-${c}-${s}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(x - centerX, y - centerY);

          if (dist < minDistance) {
            minDistance = dist;
            closestSlot = { shelfIndex: c, slotIndex: s };
          }
        }
      }
    }
    return closestSlot;
  };

  // Handle slot tap / click
  const handleSlotClick = (shelfIndex: number, slotIndex: number) => {
    if (isProcessingMatch) return;

    // Check Hammer Mode
    if (isHammerActive) {
      handleApplyHammerSmash(shelfIndex, slotIndex);
      return;
    }

    if (!selectedSlot) {
      // Select source slot
      if (shelves[shelfIndex][slotIndex].stack.length > 0) {
        audio.playTap();
        setSelectedSlot({ shelfIndex, slotIndex });
      }
    } else {
      // Execute move to target slot
      executeMove(selectedSlot, { shelfIndex, slotIndex });
      setSelectedSlot(null);
    }
  };

  // Drag Pointer Handlers with Magnetic Snap
  const handlePointerDownSlot = (
    e: React.PointerEvent,
    shelfIndex: number,
    slotIndex: number
  ) => {
    if (isProcessingMatch || isHammerActive) return;
    const slot = shelves[shelfIndex][slotIndex];
    if (slot.stack.length === 0) return;

    dragPointerIdRef.current = e.pointerId;
    dragStartSlotRef.current = { shelfIndex, slotIndex };
    setDraggedSlot({ shelfIndex, slotIndex });
    setDragPosition({ x: e.clientX, y: e.clientY });
    audio.playDrag();

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedSlot && e.pointerId === dragPointerIdRef.current) {
      setDragPosition({ x: e.clientX, y: e.clientY });

      // Calculate magnetic target drop slot
      const nearest = getClosestEmptySlot(e.clientX, e.clientY);
      setTargetDropSlot(nearest);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedSlot && e.pointerId === dragPointerIdRef.current) {
      const startSlot = dragStartSlotRef.current;
      const targetSlot = targetDropSlot || getClosestEmptySlot(e.clientX, e.clientY);

      if (startSlot && targetSlot) {
        executeMove(startSlot, targetSlot);
      }

      setDraggedSlot(null);
      setDragPosition(null);
      setTargetDropSlot(null);
      dragPointerIdRef.current = null;
      dragStartSlotRef.current = null;
    }
  };

  // Shuffle Front Products on Board
  const handleShuffle = () => {
    if (isProcessingMatch) return;
    saveStateToHistory();
    audio.playTap();

    const allFrontProducts: ProductInstance[] = [];
    shelves.forEach((comp) => {
      comp.forEach((slot) => {
        if (slot.stack[0]) {
          allFrontProducts.push(slot.stack[0]);
        }
      });
    });

    // Shuffle array
    for (let i = allFrontProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = allFrontProducts[i];
      allFrontProducts[i] = allFrontProducts[j];
      allFrontProducts[j] = temp;
    }

    let pIdx = 0;
    const updatedShelves = shelves.map((comp) =>
      comp.map((slot) => {
        if (slot.stack.length > 0) {
          return {
            ...slot,
            stack: [allFrontProducts[pIdx++], ...slot.stack.slice(1)],
          };
        }
        return slot;
      })
    );

    setShelves(updatedShelves);
  };

  // Hint Generator: Find 3 matching items and bounce them
  const handleHint = () => {
    if (progress.hintsRemaining <= 0 || isProcessingMatch) return;

    // Scan for any matching items
    const prodCounts: Record<string, { c: number; s: number }[]> = {};
    shelves.forEach((comp, c) => {
      comp.forEach((slot, s) => {
        const item = slot.stack[0];
        if (item && !item.isLocked && !item.isFrozen) {
          if (!prodCounts[item.productId]) prodCounts[item.productId] = [];
          prodCounts[item.productId].push({ c, s });
        }
      });
    });

    for (const [_, coords] of Object.entries(prodCounts)) {
      if (coords.length >= 2) {
        const target = coords[0];
        setHintedSlot({ shelfIndex: target.c, slotIndex: target.s });
        onUpdateSettings({ hintsRemaining: progress.hintsRemaining - 1 });
        audio.playTap();
        setTimeout(() => setHintedSlot(null), 2000);
        return;
      }
    }
  };

  const handleDoorAnimationComplete = useCallback(() => {
    setIsDoorClosingAnimationActive(false);
    setIsComplete(true);
  }, []);

  const handleLevelVictory = () => {
    setIsComplete(false);
    onLevelComplete(level.levelNumber, score, currentStars, newlyUnlockedIds);
  };

  const isWarningTime = timeRemaining <= 15 && !isTimeFrozen;

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative h-screen h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-slate-100 flex flex-col justify-between items-center select-none overflow-hidden touch-none py-1 px-1 sm:px-3"
    >
      {/* Cool Ambient Lighting & Ice Crystals Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />

      {/* Top HUD */}
      <TopHUD
        levelNumber={level.levelNumber}
        levelTitle={level.title}
        score={score}
        movesLeft={movesLeft}
        timeRemaining={timeRemaining}
        isTimeFrozen={isTimeFrozen}
        freezeSecondsRemaining={freezeSecondsRemaining}
        stars={currentStars}
        starThresholds={level.starThresholds}
        remainingProductsCount={totalProductsRemaining}
        soundEnabled={progress.soundEnabled}
        onToggleSound={() => onUpdateSettings({ soundEnabled: !progress.soundEnabled })}
        onPause={() => {
          audio.playTap();
          setIsPaused(true);
        }}
      />

      {/* Main Refrigerator / Deep Freezer Cabinet (Buzdolabı Gövdesi) */}
      <main className="relative flex-1 w-full max-w-sm sm:max-w-md flex flex-col justify-center px-1 py-0.5 z-10 overflow-hidden my-auto max-h-[calc(100dvh-110px)]">
        {/* Refrigerator Showcase Frame with Red Pulsing Warning Aura when Time <= 15s */}
        <div
          className={`w-full relative flex flex-col my-auto rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 sm:border-4 p-1.5 sm:p-2.5 overflow-hidden transition-all duration-300 ${
            isWarningTime
              ? 'border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.95)] animate-pulse'
              : 'border-slate-300/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Dual Side Vertical LED Light Strips */}
          <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-cyan-300/80 shadow-[0_0_15px_#67e8f9] z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1 sm:w-1.5 h-full bg-cyan-300/80 shadow-[0_0_15px_#67e8f9] z-20 pointer-events-none" />

          {/* Refrigerator Temperature & Mode Header */}
          <div
            className={`w-full rounded-lg sm:rounded-xl px-2 py-1 mb-1.5 sm:mb-2 border flex items-center justify-between shadow-inner transition-colors ${
              isWarningTime
                ? 'bg-rose-950/90 border-rose-500'
                : 'bg-slate-950/90 border-sky-400/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full animate-ping ${
                  isWarningTime
                    ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                    : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] font-black tracking-widest uppercase ${
                  isWarningTime ? 'text-rose-300' : 'text-cyan-300'
                }`}
              >
                {isWarningTime ? '⚠️ KAPAK AÇIK ALARMI' : 'FROST-FREE COOLER'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs font-black text-amber-300">
              <span className="bg-sky-950 px-1.5 py-0.5 rounded border border-sky-400/50 text-cyan-200">
                ❄️ -18°C
              </span>
              <span className="bg-sky-950 px-1.5 py-0.5 rounded border border-sky-400/50 text-amber-300">
                3°C
              </span>
            </div>
          </div>

          {/* 4 Refrigerator Shelf Rows (yatayda 4 sıra) */}
          <div className="w-full flex flex-col gap-1.5 sm:gap-2">
            {Array.from({ length: 4 }, (_, rIdx) => {
              const rowCompartments = shelves.slice(rIdx * 3, rIdx * 3 + 3);
              const isRowEmpty = rowCompartments.every((comp) =>
                comp.every((s) => s.stack.length === 0)
              );

              // Row Labels: Top = Freezer, Middle = Cold Drinks, Bottom = Crisper
              const rowLabel =
                rIdx === 0
                  ? '❄️ DERİN DONDURUCU KATI'
                  : rIdx === 3
                  ? '🧊 SÜPER SOĞUTMA ÇEKMECESİ'
                  : `🥤 SOĞUK İÇECEK KATI ${rIdx}`;

              return (
                <div key={`shelf-row-${rIdx}`} className="w-full flex flex-col gap-1">
                  {/* Row Shelf Zone Header Badge */}
                  <div className="w-full flex items-center justify-between px-2 text-[9px] font-black text-sky-200/80 tracking-wider uppercase">
                    <span>{rowLabel}</span>
                    {isRowEmpty && <span className="text-emerald-400 font-bold">✓ TEMİZLENDİ</span>}
                  </div>

                  {/* 3 Compartments in this Row */}
                  <div
                    className={`w-full flex items-center justify-between gap-1.5 p-1 rounded-2xl border transition-all duration-300 ${
                      isRowEmpty
                        ? 'bg-sky-950/20 border-dashed border-sky-300/30 opacity-40'
                        : rIdx === 0
                        ? 'bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-sky-950/80 border-cyan-300/50 shadow-md'
                        : 'bg-slate-900/80 border-sky-200/40 shadow-sm'
                    }`}
                  >
                    {rowCompartments.map((compSlots, cOffset) => {
                      const compIdx = rIdx * 3 + cOffset;
                      return (
                        <ShelfView
                          key={`comp-${compIdx}`}
                          compartmentIndex={compIdx}
                          slots={compSlots}
                          selectedSlot={selectedSlot}
                          draggedSlot={draggedSlot}
                          hintedSlot={hintedSlot}
                          targetDropSlot={targetDropSlot}
                          onSlotClick={handleSlotClick}
                          onPointerDownSlot={handlePointerDownSlot}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Celebratory Match Effect Banner & Confetti */}
        <MatchEffect
          activeMatch={activeMatch}
          onComplete={() => setActiveMatch(null)}
        />
      </main>

      {/* Bottom Controls with Icon-Only Action Buttons */}
      <BottomControls
        onUndo={handleUndo}
        canUndo={history.length > 0}
        onFreezeTime={handleFreezeTime}
        isTimeFrozen={isTimeFrozen}
        onToggleHammer={handleToggleHammer}
        isHammerActive={isHammerActive}
        onShuffle={handleShuffle}
        onHint={handleHint}
        hintsRemaining={progress.hintsRemaining}
      />

      {/* Floating Drag Avatar following finger/cursor */}
      {draggedSlot && dragPosition && shelves[draggedSlot.shelfIndex]?.[draggedSlot.slotIndex]?.stack[0] && (
        <div
          className="fixed pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 scale-150 rotate-3 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          style={{
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
          }}
        >
          <ProductPackage
            product={shelves[draggedSlot.shelfIndex][draggedSlot.slotIndex].stack[0]}
            size="normal"
            isDragging={true}
          />
        </div>
      )}

      {/* Modals */}
      {isPaused && (
        <PauseModal
          levelNumber={level.levelNumber}
          soundEnabled={progress.soundEnabled}
          musicEnabled={progress.musicEnabled}
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onLevelSelect={onLevelSelect}
          onMainMenu={onMainMenu}
          onToggleSound={() => onUpdateSettings({ soundEnabled: !progress.soundEnabled })}
          onToggleMusic={() => onUpdateSettings({ musicEnabled: !progress.musicEnabled })}
        />
      )}

      {/* Refrigerator Door Slam Animation on Victory */}
      <FridgeDoorCloseAnimation
        isActive={isDoorClosingAnimationActive}
        onComplete={handleDoorAnimationComplete}
      />

      {isComplete && (
        <LevelCompleteModal
          levelNumber={level.levelNumber}
          score={score}
          stars={currentStars}
          movesLeftBonus={(movesLeft || 0) * 50}
          isNewHighScore={score > (progress.highScores[level.levelNumber] || 0)}
          newUnlockedProductIds={newlyUnlockedIds}
          hasNextLevel={level.levelNumber < 100}
          onNextLevel={handleLevelVictory}
          onReplay={handleRestart}
          onMainMenu={onMainMenu}
        />
      )}

      {isFailed && (
        <LevelFailedModal
          levelNumber={level.levelNumber}
          score={score}
          remainingProductsCount={totalProductsRemaining}
          onRetry={handleRestart}
          onLevelSelect={onLevelSelect}
          onMainMenu={onMainMenu}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onBack={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
};
