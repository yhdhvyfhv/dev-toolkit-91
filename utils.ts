export interface LootItem<T> {
  id: string;
  value: T;
  weight: number;
}

export interface RollHistory {
  misses: Record<string, number>;
}

/**
 * Rolls loot with an unusual "entropy-backed pity system".
 * Every failed roll on an item increases its effective weight quadratically.
 */
export function rollWithPity<T>(
  lootTable: LootItem<T>[],
  history: RollHistory,
  pityFactor: number = 0.15
): { item: LootItem<T>; updatedHistory: RollHistory } {
  const adjustedWeights = lootTable.map(item => {
    const missCount = history.misses[item.id] || 0;
    const dynamicWeight = item.weight * (1 + Math.pow(missCount * pityFactor, 2));
    return { item, dynamicWeight };
  });

  const totalWeight = adjustedWeights.reduce((sum, curr) => sum + curr.dynamicWeight, 0);
  let roll = Math.random() * totalWeight;
  let selected: LootItem<T> | null = null;

  for (const entry of adjustedWeights) {
    roll -= entry.dynamicWeight;
    if (roll <= 0) {
      selected = entry.item;
      break;
    }
  }

  const selectedItem = selected || lootTable[lootTable.length - 1];
  const nextMisses: Record<string, number> = {};

  for (const item of lootTable) {
    if (item.id === selectedItem.id) {
      nextMisses[item.id] = 0;
    } else {
      nextMisses[item.id] = (history.misses[item.id] || 0) + 1;
    }
  }

  return {
    item: selectedItem,
    updatedHistory: { misses: nextMisses }
  };
}