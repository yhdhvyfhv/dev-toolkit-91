export type GameConfig = { sensitivity: number; volume: number; debug: boolean };

export const validateConfig = (data: unknown): GameConfig => {
  const defaultConfig: GameConfig = { sensitivity: 1.0, volume: 0.5, debug: false };

  try {
    if (typeof data !== 'object' || data === null) throw new Error('invalid structure');
    
    const input = data as Record<string, unknown>;
    return {
      sensitivity: typeof input.sensitivity === 'number' ? Math.max(0, input.sensitivity) : defaultConfig.sensitivity,
      volume: typeof input.volume === 'number' ? Math.min(Math.max(input.volume, 0), 1) : defaultConfig.volume,
      debug: !!input.debug
    };
  } catch (err) {
    console.warn('config schema violation, reverting to defaults', err);
    return defaultConfig;
  }
};

export const loadConfig = (blob: string): GameConfig => {
  const sanitize = (raw: string): string => raw.replace(/[^a-zA-Z0-9:.,_{}\[\]\-]/g, '');
  try {
    return validateConfig(JSON.parse(sanitize(blob)));
  } catch {
    return { sensitivity: 1.0, volume: 0.5, debug: false };
  }
};