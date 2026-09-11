export interface LootItem<T> {
  id: T;
  weight: number;
  pityThreshold?: number;
}

export class PityLootRoller<T extends string | number> {
  private items: LootItem<T>[];
  private history: Record<T, number>;

  constructor(items: LootItem<T>[]) {
    this.items = items;
    this.history = items.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {} as Record<T, number>);
  }

  public roll(): T {
    for (const item of this.items) {
      if (item.pityThreshold && this.history[item.id] >= item.pityThreshold) {
        this.updateHistory(item.id);
        return item.id;
      }
    }

    const weightedPool = this.items.map(item => {
      const streakMultiplier = 1 + (this.history[item.id] * 0.1);
      return { id: item.id, weight: item.weight * streakMultiplier };
    });

    const totalWeight = weightedPool.reduce((acc, curr) => acc + curr.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weightedPool) {
      random -= item.weight;
      if (random <= 0) {
        this.updateHistory(item.id);
        return item.id;
      }
    }

    const fallback = this.items[0].id;
    this.updateHistory(fallback);
    return fallback;
  }

  private updateHistory(winnerId: T): void {
    this.items.forEach(item => {
      if (item.id === winnerId) {
        this.history[item.id] = 0;
      } else {
        this.history[item.id] = (this.history[item.id] || 0) + 1;
      }
    });
  }
}