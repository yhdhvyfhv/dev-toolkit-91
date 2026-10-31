/**
 * @file Procedural difficulty dynamic configuration engine for game balancing.
 */

export type FactionId = 'cyber_samurai' | 'neon_monk' | 'void_runner';

/**
 * Mathematical scale multiplier vector applied to world entity spawns.
 */
export interface SpawnScaleConfig {
  /** Multiplier for enemy health pool scaling. */
  readonly hpMultiplier: number;
  /** Multiplier for item drop rarity bias (0.1 to 5.0). */
  readonly lootRarityWeight: number;
  /** Aggro radius offset in global game units. */
  readonly aggroDistanceOffset: number;
}

/**
 * Configuration schema map per game faction with auto-fallback defaults.
 */
export type FactionConfigMap = Record<FactionId, Partial<SpawnScaleConfig>>;

/**
 * Core configuration state store with dynamic compute hooks.
 */
export class DynamicDifficultyEngine {
  private readonly baseConfig: Readonly<SpawnScaleConfig>;
  private readonly factionOverrides: FactionConfigMap;

  /**
   * Constructs the difficulty engine with base scaling vectors.
   * @param base Default scaling metrics for unaligned entities.
   * @param overrides Per-faction specific override multipliers.
   */
  constructor(base: SpawnScaleConfig, overrides: FactionConfigMap) {
    this.baseConfig = Object.freeze({ ...base });
    this.factionOverrides = overrides;
  }

  /**
   * Resolves runtime scalar values for a given faction and level wave index.
   * Uses dynamic object proxy evaluation to compute live metrics.
   * 
   * @param faction Targeted enemy faction key.
   * @param waveIndex Current arena wave depth index (1-based).
   * @returns Fully resolved spawn scale configuration snapshot.
   */
  public resolveWaveScale(faction: FactionId, waveIndex: number): SpawnScaleConfig {
    const factionData = this.factionOverrides[faction] ?? {};
    const depthFactor = Math.log2(Math.max(1, waveIndex)) + 1;

    return new Proxy(this.baseConfig, {
      get: (target: SpawnScaleConfig, prop: keyof SpawnScaleConfig): number => {
        const baseVal = target[prop] ?? 1.0;
        const overrideVal = factionData[prop];
        const activeVal = overrideVal !== undefined ? overrideVal : baseVal;

        if (prop === 'aggroDistanceOffset') {
          return activeVal + Math.min(waveIndex * 0.5, 15);
        }
        return Number((activeVal * depthFactor).toFixed(3));
      }
    });
  }
}

/** Pre-baked balanced defaults for standard game instances. */
export const DEFAULT_DIFFICULTY_CONFIG: DynamicDifficultyEngine = new DynamicDifficultyEngine(
  { hpMultiplier: 1.2, lootRarityWeight: 1.0, aggroDistanceOffset: 5.0 },
  {
    cyber_samurai: { hpMultiplier: 1.8 },
    neon_monk: { aggroDistanceOffset: 12.0 },
    void_runner: { lootRarityWeight: 2.5 }
  }
);