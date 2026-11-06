export interface GameConfig {
  renderMode: 'webgl' | 'canvas';
  maxLatencyMs: number;
}

export const validateConfig = (config: unknown): GameConfig => {
  if (typeof config !== 'object' || config === null) {
    throw new Error('invalid config schema');
  }

  const safe = config as Partial<GameConfig>;
  const mode = ['webgl', 'canvas'].includes(safe.renderMode!) ? safe.renderMode : 'webgl';
  const latency = (typeof safe.maxLatencyMs === 'number' && safe.maxLatencyMs > 0) ? safe.maxLatencyMs : 150;

  return { renderMode: mode as 'webgl' | 'canvas', maxLatencyMs: latency };
};

export const safeLoad = (raw: string): GameConfig => {
  try {
    return validateConfig(JSON.parse(raw));
  } catch (err) {
    console.error('config fallback trigger:', err);
    return { renderMode: 'canvas', maxLatencyMs: 500 };
  }
};

export const CONFIG_DEFAULTS: GameConfig = Object.freeze({
  renderMode: 'webgl',
  maxLatencyMs: 100
});