export interface GameConfig {
  renderScale: number;
  maxFps: number;
  audioEnabled: boolean;
  debugMode: boolean;
}

const defaults: GameConfig = {
  renderScale: 1.0,
  maxFps: 60,
  audioEnabled: true,
  debugMode: false
};

export const loadConfig = (input: Partial<GameConfig> = {}): GameConfig => {
  const config = { ...defaults, ...input };
  
  return Object.freeze({
    renderScale: Math.max(0.5, Math.min(2.0, config.renderScale)),
    maxFps: config.maxFps > 0 ? config.maxFps : defaults.maxFps,
    audioEnabled: !!config.audioEnabled,
    debugMode: !!config.debugMode
  });
};

export const merge = <T extends object>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      (result as any)[key] = source[key];
    }
  }
  return result;
};