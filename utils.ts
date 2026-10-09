export interface LootItem {
  id: string;
  weight: number;
  isRare: boolean;
}

export interface RollResult {
  item: LootItem;
  pityState: number;
  seedState: number;
}

/**
 * A seedable, deterministic pseudo-random loot roller with an aggressive pity-scaling modifier.
 * Uses a chaotic fractional-sine generator for predictability across client/server.
 */
export function rollLoot(
  pool: LootItem[],
  seed: number,
  pityCounter: number,
  pityThreshold: number = 10,
  pityWeightMultiplier: number = 2.5
): RollResult {
  if (pool.length === 0) {
    throw new Error("Loot pool cannot be empty");
  }

  // Linear Congruential / Sine fractional generator for seed progression
  const nextSeed = (seed * 1664525 + 1013904223) % 4294967296;
  const pseudoRandom = Math.abs(Math.sin(nextSeed)) % 1;

  // Apply dynamic pity amplification to rare items if pity is building up
  const scalePity = pityCounter >= pityThreshold;
  const adjustedPool = pool.map((item) => {
    let weight = item.weight;
    if (item.isRare && scalePity) {
      const pityBonus = (pityCounter - pityThreshold + 1) * pityWeightMultiplier;
      weight += pityBonus;
    }
    return { ...item, calculatedWeight: Math.max(0, weight) };
  });

  const totalWeight = adjustedPool.reduce((sum, item) => sum + item.calculatedWeight, 0);
  let roll = pseudoRandom * totalWeight;

  let selectedItem = adjustedPool[adjustedPool.length - 1];
  for (const item of adjustedPool) {
    roll -= item.calculatedWeight;
    if (roll <= 0) {
      selectedItem = item;
      break;
    }
  }

  const resetPity = selectedItem.isRare;

  return {
    item: { id: selectedItem.id, weight: selectedItem.weight, isRare: selectedItem.isRare },
    pityState: resetPity ? 0 : pityCounter + 1,
    seedState: nextSeed,
  };
}