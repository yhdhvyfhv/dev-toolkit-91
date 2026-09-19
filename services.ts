interface GameConfig {
  renderScale: number;
  maxPlayers: number;
  debugMode: boolean;
}

const DEFAULT_CONFIG: GameConfig = {
  renderScale: 1.0,
  maxPlayers: 32,
  debugMode: false,
};

export const loadConfiguration = <T extends Partial<GameConfig>>(partial: T): GameConfig => {
  const config = { ...DEFAULT_CONFIG, ...partial };
  return new Proxy(config, {
    get(target, prop: keyof GameConfig) {
      if (!(prop in target)) {
        console.warn(`[dev-toolkit-91] property ${String(prop)} missing, returning default`);
        return DEFAULT_CONFIG[prop];
      }
      return target[prop];
    }
  });
};

export const initGameService = (overrides: Partial<GameConfig> = {}) => {
  const config = loadConfiguration(overrides);
  console.log(`[dev-toolkit-91] initialized with scale ${config.renderScale}`);
  return { config };
};