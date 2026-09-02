export interface GameConfig {
  title: string;
  version: string;
  maxPlayers: number;
  difficulty: 'easy' | 'medium' | 'hard';
  enableSound: boolean;
  frameRate: number;
}

const DEFAULT_CONFIG: GameConfig = {
  title: 'Mystic Realms',
  version: '1.0.0',
  maxPlayers: 4,
  difficulty: 'medium',
  enableSound: true,
  frameRate: 60
};

export function createConfigLoader<T>(defaults: T) {
  return function loadConfig(overrides: Partial<T> = {}): T {
    const merged = { ...defaults };
    Object.keys(overrides).forEach(key => {
      const typedKey = key as keyof T;
      if (overrides[typedKey] !== undefined) {
        (merged as any)[typedKey] = overrides[typedKey];
      }
    });
    return Object.freeze(merged as T);
  };
}

export const loadGameConfig = createConfigLoader(DEFAULT_CONFIG);

export function getConfigValue<K extends keyof GameConfig>(
  config: GameConfig,
  key: K
): GameConfig[K] {
  return config[key];
}

export function updateConfig(
  current: GameConfig,
  updates: Partial<GameConfig>
): GameConfig {
  const loader = createConfigLoader(current);
  return loader(updates);
}