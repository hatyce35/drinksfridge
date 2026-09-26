import { UserProgress } from '../types/game';

const STORAGE_KEY = 'shelf_match_save_data_v1';

const DEFAULT_PROGRESS: UserProgress = {
  currentLevel: 1,
  highestLevelUnlocked: 1,
  starsPerLevel: {},
  highScores: {},
  unlockedProductIds: ['fizz_up', 'pop_fizz', 'crunchy', 'sunny_juice'],
  hintsRemaining: 3,
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
};

export const loadProgress = (): UserProgress => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      starsPerLevel: parsed.starsPerLevel || {},
      highScores: parsed.highScores || {},
      unlockedProductIds: parsed.unlockedProductIds || DEFAULT_PROGRESS.unlockedProductIds,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

export const unlockProducts = (currentProgress: UserProgress, productIds: string[]): UserProgress => {
  const currentSet = new Set(currentProgress.unlockedProductIds);
  let changed = false;
  productIds.forEach((id) => {
    if (!currentSet.has(id)) {
      currentSet.add(id);
      changed = true;
    }
  });

  if (!changed) return currentProgress;
  const updated: UserProgress = {
    ...currentProgress,
    unlockedProductIds: Array.from(currentSet),
  };
  saveProgress(updated);
  return updated;
};

export const completeLevelSave = (
  currentProgress: UserProgress,
  levelNumber: number,
  stars: number,
  score: number
): UserProgress => {
  const currentStars = currentProgress.starsPerLevel[levelNumber] || 0;
  const bestStars = Math.max(currentStars, stars);
  const currentHighScore = currentProgress.highScores[levelNumber] || 0;
  const bestScore = Math.max(currentHighScore, score);

  const highestUnlocked = Math.max(
    currentProgress.highestLevelUnlocked,
    Math.min(40, levelNumber + 1)
  );

  // Bonus hint award if achieved 3 stars on new level
  const earnedBonusHint = stars === 3 && currentStars < 3;

  const updated: UserProgress = {
    ...currentProgress,
    highestLevelUnlocked: highestUnlocked,
    currentLevel: Math.min(40, levelNumber + 1),
    starsPerLevel: {
      ...currentProgress.starsPerLevel,
      [levelNumber]: bestStars,
    },
    highScores: {
      ...currentProgress.highScores,
      [levelNumber]: bestScore,
    },
    hintsRemaining: earnedBonusHint
      ? currentProgress.hintsRemaining + 1
      : currentProgress.hintsRemaining,
  };

  saveProgress(updated);
  return updated;
};

export const resetAllProgress = (): UserProgress => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  saveProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
};
