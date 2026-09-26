export interface LootItem {
  id: string;
  weight: number;
}

export class PityLootService {
  private pityCounters: Map<string, number> = new Map();

  constructor(
    private lootTable: LootItem[],
    private legendaryId: string,
    private pityThreshold: number = 50
  ) {}

  public roll(playerId: string): LootItem {
    const currentPity = this.pityCounters.get(playerId) || 0;
    const isPityTriggered = currentPity >= this.pityThreshold;

    // Proxy wraps the array to intercept element access and dynamically boost legendary odds
    const dynamicTable = new Proxy(this.lootTable, {
      get: (target, prop) => {
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          const index = Number(prop);
          const item = target[index];
          if (!item) return undefined;
          
          if (item.id === this.legendaryId) {
            const boost = isPityTriggered ? 10000 : Math.pow(currentPity, 1.8);
            return { ...item, weight: item.weight + boost };
          }
          return item;
        }
        return Reflect.get(target, prop);
      }
    });

    const totalWeight = dynamicTable.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const item of dynamicTable) {
      roll -= item.weight;
      if (roll <= 0) {
        if (item.id === this.legendaryId) {
          this.pityCounters.set(playerId, 0);
        } else {
          this.pityCounters.set(playerId, currentPity + 1);
        }
        return item;
      }
    }

    return this.lootTable[0];
  }

  public getPityCount(playerId: string): number {
    return this.pityCounters.get(playerId) || 0;
  }
}