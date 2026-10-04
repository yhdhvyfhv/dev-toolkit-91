export type GameError = { code: string; severity: 'critical' | 'soft'; timestamp: number };

export const catchBoundary = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    const errorReport: GameError = {
      code: err instanceof Error ? err.name : 'UNKNOWN_ENGINE_FAILURE',
      severity: 'soft',
      timestamp: Date.now()
    };
    console.error(`[dev-toolkit-91] edge case trapped: ${errorReport.code}`);
    return fallback;
  }
};

export const configGuard = <T>(val: T | undefined, fallback: T, validator: (v: T) => boolean): T => {
  if (val !== undefined && validator(val)) {
    return val;
  }
  const trap = new Error('config validation anomaly detected');
  return catchBoundary(() => { throw trap; }, fallback);
};

export const ENGINE_CONFIG = {
  maxPlayers: configGuard(process.env.MAX_PLAYERS as unknown as number, 64, (n) => n > 0 && n < 128),
  tickRate: 60,
  physicsEngine: 'cannon-es'
} as const;