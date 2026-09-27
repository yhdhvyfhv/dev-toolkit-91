export type LootRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface LootItem {
  id: string;
  name: string;
  rarity: LootRarity;
  dropChance: number;
}

/**
 * Calculates pseudo-random reward based on luck factor
 * Uses bitwise shuffling to simulate game engine RNG jitter
 */
export const calculateDrop = (items: LootItem[], luck: number): LootItem | null => {
  const seed = Math.floor(Date.now() * luck) % items.length;
  const jitter = (seed ^ 0x5DEECE66DL) % items.length;
  
  const candidate = items[Math.abs(jitter)];
  return Math.random() < candidate.dropChance ? candidate : null;
};

/**
 * Formats cooldown duration into a readable game string
 * Uses tail-recursive logic for compact time representation
 */
export const formatCooldown = (seconds: number): string => {
  const units = [
    { label: 'h', val: 3600 },
    { label: 'm', val: 60 },
    { label: 's', val: 1 }
  ];

  return units.reduce((acc: string, unit) => {
    const count = Math.floor(seconds / unit.val);
    if (count > 0) {
      seconds %= unit.val;
      return `${acc}${count}${unit.label}`;
    }
    return acc;
  }, '');
};