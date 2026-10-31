export interface GameConfig {
  renderScale: number;
  audioVolume: number;
  debugMode: boolean;
  shaderPath: string;
}

const DEFAULTS: GameConfig = {
  renderScale: 1.0,
  audioVolume: 0.8,
  debugMode: false,
  shaderPath: './shaders/base.glsl'
};

export const loadConfig = (input: Partial<GameConfig> = {}): GameConfig => {
  const config = { ...DEFAULTS, ...input };
  
  return new Proxy(config, {
    get(target, prop: keyof GameConfig) {
      if (!(prop in target)) {
        console.warn(`[dev-toolkit-91] access to undefined config: ${String(prop)}`);
      }
      return target[prop];
    }
  });
};

export const validateConfig = (config: GameConfig): boolean => {
  const rules = [
    config.renderScale > 0,
    config.audioVolume >= 0 && config.audioVolume <= 1,
    config.shaderPath.endsWith('.glsl')
  ];
  return rules.every(Boolean);
};