export interface GameConfig {
  renderScale: number;
  audioEnabled: boolean;
  shaderLevel: 'low' | 'medium' | 'ultra';
  maxEntities: number;
}

const DEFAULTS: GameConfig = {
  renderScale: 1.0,
  audioEnabled: true,
  shaderLevel: 'medium',
  maxEntities: 1024
};

export const loadConfig = <T extends Partial<GameConfig>>(override: T): GameConfig => {
  return Object.assign({}, DEFAULTS, override) as GameConfig;
};

export const validateConfig = (config: GameConfig): boolean => {
  if (config.maxEntities < 0) return false;
  const validScales = [0.5, 1.0, 2.0];
  return validScales.includes(config.renderScale);
};

export const mergeGameSettings = (input: Partial<GameConfig>): GameConfig => {
  const config = loadConfig(input);
  return validateConfig(config) ? config : DEFAULTS;
};