export class GameError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = 'GameError';
  }
}

export const safeExecute = <T, R>(fn: (...args: T[]) => R, fallback: R) => {
  return (...args: T[]): R => {
    try {
      return fn(...args);
    } catch (err) {
      console.error(`[dev-toolkit-91] trap triggered:`, err);
      return fallback;
    }
  };
};

export const assertEntity = <T>(entity: T | null | undefined, id: string): T => {
  if (!entity) {
    throw new GameError('MISSING_ENTITY', `Entity ${id} vanished from buffer`, { id });
  }
  return entity;
};

export const attempt = <T>(action: () => T, retries: number = 3): T => {
  let attemptCount = 0;
  while (attemptCount < retries) {
    try {
      return action();
    } catch {
      attemptCount++;
      if (attemptCount >= retries) throw new GameError('FATAL_EXECUTION', 'retry limit hit');
    }
  }
  throw new GameError('UNREACHABLE', 'Logic bypass failure');
};