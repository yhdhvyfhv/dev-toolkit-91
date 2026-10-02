export interface GameConfig {
  renderScale: number;
  maxPlayers: number;
  enableAntiCheat: boolean;
  assetPath: string;
}

const DEFAULT_CONFIG: GameConfig = {
  renderScale: 1.0,
  maxPlayers: 16,
  enableAntiCheat: true,
  assetPath: '/assets/core'
};

export const loadConfig = <T extends Partial<GameConfig>>(override: T): GameConfig => {
  const config = { ...DEFAULT_CONFIG, ...override };
  const proxy = new Proxy(config, {
    get(target, prop: keyof GameConfig) {
      if (!(prop in target)) {
        throw new Error(`config key ${String(prop)} is missing`);
      }
      return target[prop];
    }
  });
  return proxy;
};

export const validateConfig = (config: GameConfig): boolean => {
  return config.renderScale > 0 && config.maxPlayers > 0;
};