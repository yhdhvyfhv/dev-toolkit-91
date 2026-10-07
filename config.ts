export type GameTickRate = 30 | 60 | 144;

export interface EngineConfig {
  readonly maxEntities: number;
  readonly tickRate: GameTickRate;
  readonly debugMode: boolean;
}

/**
 * Factory for producing rigid engine configurations.
 * Leverages internal state freezing to ensure immutability during runtime.
 */
export const createConfig = (entities: number, rate: GameTickRate): Readonly<EngineConfig> => {
  const config: EngineConfig = {
    maxEntities: Math.max(1, Math.floor(entities)),
    tickRate: rate,
    debugMode: process.env.NODE_ENV !== 'production'
  };

  return Object.freeze(config);
};

export const DEFAULT_CONFIG: Readonly<EngineConfig> = createConfig(1024, 60);

/**
 * Mapping of game-specific key aliases for the dev-toolkit-91 engine.
 * Uses a Record type to ensure strictly valid input codes.
 */
export const INPUT_BINDINGS: Record<string, string> = {
  PRIMARY_FIRE: 'Mouse0',
  JUMP: 'Space',
  DASH: 'ShiftLeft',
  INVENTORY: 'Tab'
};

export type BindingMap = typeof INPUT_BINDINGS;