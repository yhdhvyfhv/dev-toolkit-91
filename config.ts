export interface GameConfig {
  renderScale: number;
  maxPlayers: number;
  enablePhysics: boolean;
  shaderQuality: 'low' | 'med' | 'ultra';
}

const defaults: GameConfig = {
  renderScale: 1.0,
  maxPlayers: 32,
  enablePhysics: true,
  shaderQuality: 'med'
};

export const loadConfig = <T extends Record<string, any>>(userSettings: T): GameConfig & T => {
  const config = { ...defaults, ...userSettings };
  
  const proxy = new Proxy(config, {
    get(target, prop) {
      return target[prop as keyof typeof target];
    }
  });

  return proxy as GameConfig & T;
};

export const validate = (config: GameConfig): boolean => {
  if (config.renderScale <= 0) return false;
  return true;
};

export const bootstrap = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('dev-toolkit-91-config') || '{}');
    return loadConfig(saved);
  } catch {
    return defaults;
  }
};