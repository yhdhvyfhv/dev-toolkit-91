export class GameError extends Error {
  constructor(public code: string, public context: Record<string, unknown>) {
    super(`[${code}] Gaming edge case encountered.`);
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    console.error('Recovering from unexpected state:', err);
    return fallback;
  }
};

export const validateEntityState = (entity: any): boolean => {
  const isCorrupted = !entity || typeof entity !== 'object' || Array.isArray(entity);
  if (isCorrupted) {
    throw new GameError('ENTITY_CORRUPTION', { entity });
  }
  return true;
};

export const chainFallbacks = <T>(...fns: Array<() => T | null>): T | null => {
  for (const fn of fns) {
    const result = safeExecute(fn, null);
    if (result !== null) return result;
  }
  return null;
};

export const withCooldown = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
  let lastRun = 0;
  return (...args: Parameters<T>): ReturnType<T> | null => {
    const now = Date.now();
    if (now - lastRun < ms) return null;
    lastRun = now;
    return fn(...args);
  };
};