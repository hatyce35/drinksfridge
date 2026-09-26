export type ProductCategory = 
  | 'Gazlı İçecekler' 
  | 'Meyveli Gazozlar' 
  | 'Soğuk Çaylar' 
  | 'Enerji İçecekleri' 
  | 'Özel Tarifler' 
  | 'Kutup Ferahlığı';

export type PackageType = 
  | 'standard_can' 
  | 'slim_can' 
  | 'tall_can' 
  | 'stout_can';

export interface ProductDefinition {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  slogan: string;
  category: ProductCategory;
  packageType: PackageType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  badge: string;
  flavor: string;
  calories: string;
  description: string;
}

export interface ProductInstance {
  instanceId: string;
  productId: string;
  isLocked?: boolean;     // Unlocks when any match is made
  isFrozen?: boolean;     // Thaws when matched with identical items
  isBonus?: boolean;      // Gives +5 moves when matched
  isWild?: boolean;       // Wildcard product that matches with any pair
  isRevealing?: boolean;  // Animation state when revealing from behind
  isMatching?: boolean;   // Animation state when matching
}

export interface ShelfSlot {
  shelfIndex: number;
  slotIndex: number;
  // stack[0] is FRONT visible product. stack[1..n] are hidden products directly behind it!
  stack: ProductInstance[];
}

export interface LevelData {
  levelNumber: number;
  title: string;
  shelfCount: number;
  slotsPerShelf: number;
  maxMoves: number | null; // null for early tutorial levels (unlimited)
  timeLimit?: number; // Time limit in seconds (e.g. 90s)
  starThresholds: [number, number, number]; // Score needed for 1, 2, 3 stars
  // Layout representation: array of shelves, each shelf is array of initial product ID stacks (or empty array)
  // e.g. [ [ ["fizz_up"], [], ["berry_pop", "choco_bite"] ] ]
  initialShelves: {
    productId: string;
    hiddenProductIds?: string[];
    isLocked?: boolean;
    isFrozen?: boolean;
    isBonus?: boolean;
    isWild?: boolean;
  }[][];
}

export interface UserProgress {
  currentLevel: number;
  highestLevelUnlocked: number;
  starsPerLevel: Record<number, number>; // levelNumber -> stars (1-3)
  highScores: Record<number, number>;    // levelNumber -> score
  unlockedProductIds: string[];          // collection of discovered products
  hintsRemaining: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface MatchResult {
  shelfIndex: number;
  matchedSlotIndices: number[];
  productId: string;
  count: number;
  comboMultiplier: number;
  scoreAwarded: number;
  type: 'MATCH' | 'COMBO' | 'SUPER_MATCH' | 'MEGA_MATCH';
  isRowCleared?: boolean;
  clearedRowIndex?: number;
}

export type GameView = 
  | 'MENU' 
  | 'PLAYING' 
  | 'LEVEL_SELECT' 
  | 'COLLECTION' 
  | 'SETTINGS' 
  | 'HOW_TO_PLAY';
