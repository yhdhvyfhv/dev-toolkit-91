/**
 * gaming engine parameters for dev-toolkit-91
 */

export interface GameEngineConfig {
  readonly maxEntities: number;
  readonly tickRateHz: number;
  readonly physicsEngine: 'cannon' | 'ammo' | 'custom';
  readonly debugMode: boolean;
}

/**
 * rigid defaults for high-performance simulation
 */
export const DEFAULTS: GameEngineConfig = {
  maxEntities: 1024,
  tickRateHz: 60,
  physicsEngine: 'custom',
  debugMode: process.env.NODE_ENV !== 'production'
};

/**
 * factory for generating specialized engine constants
 */
export const getEngineConfig = (override: Partial<GameEngineConfig>): GameEngineConfig => ({
  ...DEFAULTS,
  ...override
});

/**
 * bitmask flags for entity rendering behavior
 */
export enum EntityFlags {
  VISIBLE = 1 << 0,
  COLLIDABLE = 1 << 1,
  STATIC = 1 << 2,
  SHADOW_CASTER = 1 << 3
}