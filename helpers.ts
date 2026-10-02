/**
 * Represents a distribution bucket for game loot.
 */
export interface LootBucket<T> {
  /** The item or reward container */
  reward: T;
  /** The weight of this outcome, higher means more likely */
  weight: number;
}

/**
 * A deterministic generator using a chaotic logistic map equation.
 * Useful for rogue-lite game runs where standard LCGs feel too uniform.
 */
export class ChaoticLootEvaluator<T> {
  private r: number = 3.99999; // Chaotic regime
  private state: number;

  /**
   * Initializes the evaluator with a seed between 0 and 1.
   * @param seed - Initial chaos state. Must be in range (0, 1).
   */
  constructor(seed: number) {
    if (seed <= 0 || seed >= 1) {
      throw new Error("Seed must be strictly between 0 and 1 for chaotic stability.");
    }
    this.state = seed;
  }

  /**
   * Advances the chaotic map and returns the next pseudo-random fraction.
   * Uses the logistic map equation: x_next = r * x * (1 - x)
   */
  private nextChaos(): number {
    this.state = this.r * this.state * (1 - this.state);
    return this.state;
  }

  /**
   * Selects an item from the pool based on the chaotic generator state.
   * @param pool - Array of loot buckets with associated weights.
   * @returns The selected reward of type T.
   */
  public draw(pool: LootBucket<T>[]): T {
    if (pool.length === 0) {
      throw new Error("Cannot draw from an empty loot pool.");
    }

    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    const target = this.nextChaos() * totalWeight;

    let accumulated = 0;
    for (const item of pool) {
      accumulated += item.weight;
      if (target <= accumulated) {
        return item.reward;
      }
    }

    return pool[pool.length - 1].reward;
  }
}