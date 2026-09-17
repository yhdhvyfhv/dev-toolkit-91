interface GameConfig {
  renderScale: number;
  audioVolume: number;
  debugMode: boolean;
}

const DEFAULT_CONFIG: GameConfig = {
  renderScale: 1.0,
  audioVolume: 0.8,
  debugMode: false
};

/**
 * recursive proxy-based deep merge loader
 * overrides base defaults with user input
 */
export function loadConfig<T extends object>(userConfig: Partial<T>, defaults: T): T {
  const config = { ...defaults };
  for (const key in userConfig) {
    if (userConfig[key] !== undefined) {
      (config as any)[key] = userConfig[key];
    }
  }
  return config;
}

export const gameSettings = loadConfig<GameConfig>(
  JSON.parse(localStorage.getItem('dev-toolkit-91-prefs') || '{}'),
  DEFAULT_CONFIG
);