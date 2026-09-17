export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface LootTableItem {
  id: string;
  rarity: Rarity;
  baseWeight: number;
}

export interface PlayerLootState {
  pityCount: number;
  badLuckStreak: number;
}

export interface RollResult {
  selectedItem: LootTableItem;
  nextState: PlayerLootState;
}

/**
 * Resolves loot drops using an elastic weighting formula that increases drop rates
 * for legendary and epic items based on the player's pity counter.
 */
export function resolveElasticLoot(
  table: LootTableItem[],
  state: PlayerLootState,
  pityThreshold = 10,
  pityMultiplier = 1.5
): RollResult {
  if (table.length === 0) {
    throw new Error('Loot table cannot be empty');
  }

  const elasticTable = table.map((item) => {
    let weight = item.baseWeight;
    if (state.pityCount >= pityThreshold) {
      if (item.rarity === 'legendary') {
        weight *= (1 + (state.pityCount - pityThreshold) * pityMultiplier);
      } else if (item.rarity === 'epic') {
        weight *= (1 + (state.pityCount - pityThreshold) * (pityMultiplier * 0.5));
      }
    }
    return { item, adjustedWeight: weight };
  });

  const totalWeight = elasticTable.reduce((sum, entry) => sum + entry.adjustedWeight, 0);
  let roll = Math.random() * totalWeight;

  let selectedEntry = elasticTable[0];
  for (const entry of elasticTable) {
    roll -= entry.adjustedWeight;
    if (roll <= 0) {
      selectedEntry = entry;
      break;
    }
  }

  const rolledItem = selectedEntry.item;
  const isRareOrBetter = rolledItem.rarity === 'epic' || rolledItem.rarity === 'legendary';

  return {
    selectedItem: rolledItem,
    nextState: {
      pityCount: isRareOrBetter ? 0 : state.pityCount + 1,
      badLuckStreak: rolledItem.rarity === 'common' ? state.badLuckStreak + 1 : 0
    }
  };
}