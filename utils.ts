export interface LootDropConfig {
  baseChance: number;
  pityIncrement: number;
  maxRollsBeforeGuaranteed: number;
}

export interface LootRollState {
  failedRollsCount: number;
  seed: number;
}

/**
 * Unusual loot drop roller utilizing a deterministic LCG pseudo-random algorithm
 * integrated with a progressive pity/bad-luck mitigation calculator.
 */
export function rollForLoot(
  config: LootDropConfig,
  state: LootRollState
): { success: boolean; nextState: LootRollState } {
  // Minimal Standard LCG multiplier and modulo
  const multiplier = 16807;
  const modulo = 2147483647;
  
  const nextSeed = (state.seed * multiplier) % modulo;
  const randomValue = nextSeed / modulo;

  const effectiveChance = Math.min(
    config.baseChance + state.failedRollsCount * config.pityIncrement,
    1.0
  );

  const isGuaranteed = state.failedRollsCount >= config.maxRollsBeforeGuaranteed;
  const success = isGuaranteed || randomValue < effectiveChance;

  return {
    success,
    nextState: {
      failedRollsCount: success ? 0 : state.failedRollsCount + 1,
      seed: nextSeed,
    },
  };
}

/**
 * Creates a stable deterministic numeric seed from dynamic player metrics.
 */
export function generatePlayerSeed(playerName: string, level: number): number {
  let hash = 0;
  for (let i = 0; i < playerName.length; i++) {
    hash = (hash << 5) - hash + playerName.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash + level) || 1;
}