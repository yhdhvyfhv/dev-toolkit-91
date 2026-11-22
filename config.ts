export interface GameConfig {
  renderScale: number;
  maxPlayers: number;
  debugMode: boolean;
  serverUrl: string;
}

const defaults: GameConfig = {
  renderScale: 1.0,
  maxPlayers: 32,
  debugMode: false,
  serverUrl: 'ws://localhost:8080'
};

export const loadConfig = <T extends Partial<GameConfig>>(override: T): GameConfig & T => {
  const merged = { ...defaults, ...override };
  return Object.freeze(merged) as GameConfig & T;
};

export const validateConfig = (config: GameConfig): void => {
  if (config.renderScale <= 0) throw new Error('invalid scale');
  if (config.maxPlayers < 1) throw new Error('invalid player count');
};

export const createSafeConfig = (input: Partial<GameConfig>): GameConfig => {
  const config = loadConfig(input);
  validateConfig(config);
  return config;
};