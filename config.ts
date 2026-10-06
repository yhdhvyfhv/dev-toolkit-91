export interface GameConfig {
  resolution: { width: number; height: number };
  fpsLimit: number;
  enablePhysics: boolean;
}

const defaults: GameConfig = {
  resolution: { width: 1920, height: 1080 },
  fpsLimit: 144,
  enablePhysics: true
};

export const loadConfig = <T extends Partial<GameConfig>>(override: T): GameConfig => {
  const config = { ...defaults, ...override };
  config.resolution = { ...defaults.resolution, ...(override.resolution ?? {}) };
  
  const proxy = new Proxy(config, {
    get: (target, prop) => {
      const val = target[prop as keyof GameConfig];
      return val !== undefined ? val : defaults[prop as keyof GameConfig];
    }
  });

  return proxy;
};

export const activeConfig = loadConfig({});