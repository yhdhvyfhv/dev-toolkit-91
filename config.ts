export interface GameConfig {
  fpsLimit: number;
  renderScale: number;
  fov: number;
  difficultyMultiplier: number;
  debugMode: boolean;
  audio: {
    master: number;
    sfx: number;
  };
}

const FALLBACK_CONFIG: GameConfig = {
  fpsLimit: 60,
  renderScale: 1.0,
  fov: 90,
  difficultyMultiplier: 1.0,
  debugMode: false,
  audio: { master: 0.8, sfx: 1.0 },
};

export class ConfigValidationError extends Error {
  constructor(public readonly keyPath: string, public readonly anomaly: string) {
    super(`[Config Edge Case] Anomaly detected at "${keyPath}": ${anomaly}`);
    this.name = 'ConfigValidationError';
  }
}

export function createResilientConfig(rawInput: unknown): GameConfig {
  const sanitizeNumber = (val: unknown, min: number, max: number, fallback: number, keyPath: string): number => {
    if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
      console.warn(new ConfigValidationError(keyPath, `Invalid numeric '${val}', reverting to ${fallback}`).message);
      return fallback;
    }
    if (val < min || val > max) {
      const clamped = Math.max(min, Math.min(max, val));
      console.warn(new ConfigValidationError(keyPath, `Value ${val} out of bounds [${min}, ${max}], clamped to ${clamped}`).message);
      return clamped;
    }
    return val;
  };

  const safeInput = (typeof rawInput === 'object' && rawInput !== null) ? (rawInput as Record<string, any>) : {};
  const audioObj = (typeof safeInput.audio === 'object' && safeInput.audio !== null) ? safeInput.audio : {};

  const resolved: GameConfig = {
    fpsLimit: Math.floor(sanitizeNumber(safeInput.fpsLimit, 15, 360, FALLBACK_CONFIG.fpsLimit, 'fpsLimit')),
    renderScale: sanitizeNumber(safeInput.renderScale, 0.1, 4.0, FALLBACK_CONFIG.renderScale, 'renderScale'),
    fov: sanitizeNumber(safeInput.fov, 30, 140, FALLBACK_CONFIG.fov, 'fov'),
    difficultyMultiplier: sanitizeNumber(safeInput.difficultyMultiplier, 0.1, 10.0, FALLBACK_CONFIG.difficultyMultiplier, 'difficultyMultiplier'),
    debugMode: typeof safeInput.debugMode === 'boolean' ? safeInput.debugMode : FALLBACK_CONFIG.debugMode,
    audio: {
      master: sanitizeNumber(audioObj.master, 0.0, 1.0, FALLBACK_CONFIG.audio.master, 'audio.master'),
      sfx: sanitizeNumber(audioObj.sfx, 0.0, 1.0, FALLBACK_CONFIG.audio.sfx, 'audio.sfx'),
    },
  };

  return new Proxy(resolved, {
    get(target, prop, receiver) {
      if (Reflect.has(target, prop)) {
        return Reflect.get(target, prop, receiver);
      }
      console.warn(`[Config Edge Case] Access to missing key "${String(prop)}", returning undefined safely`);
      return undefined;
    },
  });
}