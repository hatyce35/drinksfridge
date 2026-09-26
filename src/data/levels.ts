import { LevelData } from '../types/game';

type SlotConfig = {
  productId: string;
  hiddenProductIds?: string[];
  isLocked?: boolean;
  isFrozen?: boolean;
  isBonus?: boolean;
  isWild?: boolean;
} | null;

// Refrigerator Layout: 4 rows x 3 compartments per row = 12 compartments (36 slots total)
const COMPARTMENT_COUNT = 12;

const CATALOG_KEYS = [
  'fizz_up',
  'berry_pop',
  'pop_fizz',
  'green_zest',
  'sunny_juice',
  'apple_pure',
  'berry_blast',
  'mango_tango',
  'peach_spark',
  'bubble_tea',
  'citrus_rush',
  'watermelon_wave',
  'pineapple_punch',
  'mint_cool',
  'vanilla_cream',
  'cold_brew',
  'berry_breeze',
  'coconut_fizz',
  'kiwi_burst',
  'passion_pop',
  'cola_zero',
];

// Seeded deterministic random number generator
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const LEVELS: LevelData[] = Array.from({ length: 100 }, (_, idx) => {
  const lvlNum = idx + 1;
  const rand = createSeededRandom(lvlNum * 8863 + 31);

  // Progressive difficulty curve for 100 levels:
  // Active distinct drink varieties increase steadily from 4 up to 21
  const typesCount = Math.min(CATALOG_KEYS.length, Math.max(4, Math.floor(4 + (lvlNum - 1) * 0.18)));
  const activeProducts = CATALOG_KEYS.slice(0, typesCount);

  // Empty slots in fridge: 6 on early levels down to 4 on harder levels
  const emptySlotCount = lvlNum <= 10 ? 6 : lvlNum <= 30 ? 5 : 4;
  const filledFrontCount = 36 - emptySlotCount; // 30 to 32 filled front slots

  // Stacked rear items behind front cans (increases from 6 up to 18)
  const hiddenItemCount = Math.min(18, Math.floor(6 + (lvlNum - 1) * 0.13));

  // Total items must be a multiple of 3 for valid 3-matching
  let totalItems = filledFrontCount + hiddenItemCount;
  const rem = totalItems % 3;
  if (rem !== 0) {
    totalItems += (3 - rem);
  }
  const tripleCount = totalItems / 3;

  // Build item pool: exactly tripleCount * 3 items
  const itemPool: string[] = [];
  for (let t = 0; t < tripleCount; t++) {
    const prodId = activeProducts[t % activeProducts.length];
    itemPool.push(prodId, prodId, prodId);
  }

  // Shuffle item pool thoroughly
  for (let i = itemPool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = itemPool[i];
    itemPool[i] = itemPool[j];
    itemPool[j] = temp;
  }

  // All 36 slot coordinates
  const allSlotCoordinates: { c: number; s: number }[] = [];
  for (let c = 0; c < COMPARTMENT_COUNT; c++) {
    for (let s = 0; s < 3; s++) {
      allSlotCoordinates.push({ c, s });
    }
  }

  // Shuffle slot coordinates
  const shuffledCoords = [...allSlotCoordinates];
  for (let i = shuffledCoords.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = shuffledCoords[i];
    shuffledCoords[i] = shuffledCoords[j];
    shuffledCoords[j] = temp;
  }

  const emptySlotPositions = new Set<string>();
  for (let e = 0; e < emptySlotCount; e++) {
    const coord = shuffledCoords[e];
    emptySlotPositions.add(`${coord.c}-${coord.s}`);
  }

  // Initialize compartments
  const compartments: SlotConfig[][] = Array.from({ length: COMPARTMENT_COUNT }, () => [null, null, null]);

  // Fill front slots
  let poolIdx = 0;
  for (let c = 0; c < COMPARTMENT_COUNT; c++) {
    for (let s = 0; s < 3; s++) {
      if (emptySlotPositions.has(`${c}-${s}`)) {
        compartments[c][s] = null;
      } else if (poolIdx < itemPool.length) {
        compartments[c][s] = {
          productId: itemPool[poolIdx++],
        };
      }
    }
  }

  // Distribute remaining items behind existing front cans
  const filledSlotsList: { c: number; s: number }[] = [];
  for (let c = 0; c < COMPARTMENT_COUNT; c++) {
    for (let s = 0; s < 3; s++) {
      if (compartments[c][s]) {
        filledSlotsList.push({ c, s });
      }
    }
  }

  while (poolIdx < itemPool.length && filledSlotsList.length > 0) {
    const targetSlot = filledSlotsList[Math.floor(rand() * filledSlotsList.length)];
    const slotObj = compartments[targetSlot.c][targetSlot.s];
    if (slotObj) {
      if (!slotObj.hiddenProductIds) slotObj.hiddenProductIds = [];
      if (slotObj.hiddenProductIds.length < 2) {
        slotObj.hiddenProductIds.push(itemPool[poolIdx++]);
      } else {
        const available = filledSlotsList.find(
          (sl) => (compartments[sl.c][sl.s]?.hiddenProductIds?.length || 0) < 2
        );
        if (available) {
          const availSlot = compartments[available.c][available.s]!;
          if (!availSlot.hiddenProductIds) availSlot.hiddenProductIds = [];
          availSlot.hiddenProductIds.push(itemPool[poolIdx++]);
        } else {
          break;
        }
      }
    }
  }

  // Prevent instant 3-in-a-row start
  for (let c = 0; c < COMPARTMENT_COUNT; c++) {
    const s0 = compartments[c][0];
    const s1 = compartments[c][1];
    const s2 = compartments[c][2];
    if (s0 && s1 && s2 && s0.productId === s1.productId && s1.productId === s2.productId) {
      for (let otherC = 0; otherC < COMPARTMENT_COUNT; otherC++) {
        if (otherC === c) continue;
        for (let otherS = 0; otherS < 3; otherS++) {
          const otherItem = compartments[otherC][otherS];
          if (otherItem && otherItem.productId !== s0.productId) {
            const temp = compartments[c][2];
            compartments[c][2] = compartments[otherC][otherS];
            compartments[otherC][otherS] = temp;
            break;
          }
        }
      }
    }
  }

  // Add Special Modifiers based on level tier:
  // Locked Cans (Level 20+)
  if (lvlNum >= 20) {
    const lockCount = Math.min(4, Math.floor(1 + (lvlNum - 20) * 0.08));
    let applied = 0;
    for (let c = 0; c < COMPARTMENT_COUNT && applied < lockCount; c++) {
      if (compartments[c][0] && !compartments[c][0]?.isLocked) {
        compartments[c][0]!.isLocked = true;
        applied++;
      }
    }
  }

  // Frozen Ice Cans (Level 30+)
  if (lvlNum >= 30) {
    const freezeCount = Math.min(3, Math.floor(1 + (lvlNum - 30) * 0.06));
    let applied = 0;
    for (let c = COMPARTMENT_COUNT - 1; c >= 0 && applied < freezeCount; c--) {
      if (compartments[c][1] && !compartments[c][1]?.isLocked && !compartments[c][1]?.isFrozen) {
        compartments[c][1]!.isFrozen = true;
        applied++;
      }
    }
  }

  // Bonus +5 Moves Cans (Level 40+)
  if (lvlNum >= 40) {
    for (let c = 0; c < COMPARTMENT_COUNT; c++) {
      if (compartments[c][2] && !compartments[c][2]?.isLocked && !compartments[c][2]?.isFrozen) {
        compartments[c][2]!.isBonus = true;
        break;
      }
    }
  }

  // Joker Star Cans (Level 60+)
  if (lvlNum >= 60) {
    for (let c = COMPARTMENT_COUNT - 1; c >= 0; c--) {
      if (compartments[c][0] && !compartments[c][0]?.isLocked && !compartments[c][0]?.isFrozen) {
        compartments[c][0]!.isWild = true;
        break;
      }
    }
  }

  // Moves limit strictly tightens as level number increases:
  // Levels 1-3: Unlimited
  // Level 4-10: 45 down to 38 moves
  // Level 11-30: 38 down to 28 moves
  // Level 31-60: 28 down to 22 moves
  // Level 61-80: 22 down to 18 moves
  // Level 81-100: 18 down to 16 moves (Master Tier)
  const maxMoves =
    lvlNum <= 3
      ? null
      : Math.max(16, Math.round(48 - (lvlNum - 3) * 0.33));

  const baseScore = tripleCount * 300;
  const starThresholds: [number, number, number] = [
    Math.round(baseScore * 0.7),
    Math.round(baseScore * 1.1),
    Math.round(baseScore * 1.5),
  ];

  // 100 Refrigerator-themed level titles
  const titles = [
    'Üst Dondurucu Katı', 'Buzlu İçecek Rafı', 'Soğuk Soda Çekmecesi', 'Sıfır Derece Bölmesi',
    'Derin Dondurucu 1', 'Gündüz Serinliği', 'Kutup Gazoz Katı', 'Karlovo Soğutması',
    'Aromalı Kutular', 'Meyveli Dondurucu', 'Gizli Kutu İstifi', 'Buz Kristali 1',
    'Çift Katlı Serinlik', 'Zero Sugar Bölümü', 'Kutup Esintisi', 'Yaz Soğutucusu',
    'Süper Frigo', 'Derin Soğutma 2', 'Gofretli Soda Çekmecesi', 'Kilitli Dondurucu',
    'Buzlu Kilitli Raf', 'Buz Kırma Seviyesi', 'Üçlü Dondurucu Hattı', 'Kutup Kilitleri',
    'Derin Dondurucu Zirve', 'Buzul Dolap', 'Dondurucu Tüneli', 'Güvenlikli Dolap',
    'Süper Soğutucu Katı', 'Bonus İçecek Dolabı', 'Jokerli Soğutucu', 'Eski Dondurucu Haznesi',
    'Buz Kutusu Ustası', 'Buzul Şampiyonu', 'Kutupsal Düzen', 'Mega Frigo 1',
    'Kristal Buzdolabı', 'Usta Dondurucu', 'Gökkuşağı Soğutucusu', 'Büyük Efsane Dolap',
    'Sıfırın Altı 1', 'Buzlu Soda Kulesi', 'Ultra Frigo', 'Buz Kütlesi',
    'Soğuk Hazine', 'Buzul Vadisi', 'Kutu Kasası', 'Kristal Raf 1',
    'Buzlu Karışım', 'Mega Dondurucu 50', 'Sert Soğutma', 'Buzul Kapısı',
    'Mavi Buzdolabı', 'Sıfır Derece Ustası', 'Kutu Kutusu', 'Dondurucu Tüneli 2',
    'Meyve Fırtınası', 'Buzlu Kilit 2', 'Buz Devri', '60. Seviye Frigo',
    'Kristal Zirve', 'Derin Soğukluk', 'Joker Gazoz', 'Buz Tüneli',
    'Polar Düzen', 'Süper Soğutucu 2', 'Kutup Yıldızı', '70. Seviye Dondurucu',
    'Buzul Kaleyi Aş', 'Buzlu Fırtına', 'Ultra Kutu Rafı', 'Sıfırın Altı 2',
    'Buzul Tünel 3', 'Mega Frigo Zirve', '75. Efsane Raf', 'Kuzey Kutbu',
    'Soğuk Şok', 'Kristal Dondurucu 80', 'Buzlu Labirent', 'Buz Adam',
    'Titan Frigo', 'Kutup Ekspresi', 'Ultra Soğutma', 'Kristal Kilit',
    'Mavi Dondurucu 85', 'Sıfır Şeker Tüneli', 'Mega Soğutucu 87', 'Efsane Kutu',
    'Buz Devri 89', '90. Seviye Şampiyon', 'Kutup Fırtınası', 'Son Dondurucu 92',
    'Ultra Buzul 93', 'Kristal Kafes 94', 'Buzul Ustası 95', 'Efsanevi Frigo 96',
    'Kutup Zirvesi 97', 'Son Soğutma 98', 'Buzul Efendisi 99', 'DRINKS FRIDGE ZİRVESİ',
  ];

  const initialShelves = compartments.map((comp) =>
    comp.map((slot) => {
      if (!slot) {
        return { productId: '' };
      }
      return {
        productId: slot.productId,
        hiddenProductIds: slot.hiddenProductIds || [],
        isLocked: slot.isLocked,
        isFrozen: slot.isFrozen,
        isBonus: slot.isBonus,
        isWild: slot.isWild,
      };
    })
  );

  // Countdown Timer in seconds:
  // Level 1-10: 90 seconds
  // Level 11-40: 75 seconds
  // Level 41-70: 60 seconds
  // Level 71-100: 50 seconds
  const timeLimit =
    lvlNum <= 10
      ? 90
      : lvlNum <= 40
      ? 75
      : lvlNum <= 70
      ? 60
      : 50;

  return {
    levelNumber: lvlNum,
    title: titles[idx] || `Seviye ${lvlNum}`,
    shelfCount: COMPARTMENT_COUNT,
    slotsPerShelf: 3,
    maxMoves,
    timeLimit,
    starThresholds,
    initialShelves,
  };
});
