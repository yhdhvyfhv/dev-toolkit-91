export interface GameConfig {
  renderScale: number;
  maxFps: number;
  enableVsync: boolean;
  assetPath: string;
}

const DEFAULTS: GameConfig = {
  renderScale: 1.0,
  maxFps: 60,
  enableVsync: true,
  assetPath: './assets'
};

export const loadConfig = (userConfig: Partial<GameConfig> = {}): GameConfig => {
  const config = { ...DEFAULTS, ...userConfig };

  return Object.freeze({
    ...config,
    renderScale: Math.max(0.1, Math.min(config.renderScale, 4.0)),
    maxFps: config.maxFps > 0 ? config.maxFps : 60
  });
};

export const getEnvironmentConfig = (): GameConfig => {
  const env = typeof process !== 'undefined' ? process.env : {};
  return loadConfig({
    renderScale: parseFloat(env.RENDER_SCALE || '') || undefined,
    maxFps: parseInt(env.MAX_FPS || '') || undefined,
    enableVsync: env.VSYNC === 'false' ? false : undefined
  });
};