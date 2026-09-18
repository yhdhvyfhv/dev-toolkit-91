export class GameError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = 'GameError';
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T, logger: (e: Error) => void): T => {
  try {
    return fn();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger(error);
    return fallback;
  }
};

export const assertGameState = (condition: boolean, msg: string, context?: Record<string, unknown>): void => {
  if (!condition) {
    throw new GameError('INVALID_STATE', msg, context);
  }
};

export const wrapAsync = async <T>(promise: Promise<T>, defaultValue: T): Promise<T> => {
  return promise.catch((err) => {
    console.error(`[dev-toolkit-91] async failure: ${err.message}`);
    return defaultValue;
  });
};

export const pulseCheck = (data: unknown): boolean => {
  if (data === null || typeof data !== 'object') return false;
  return 'status' in data && (data as { status: string }).status === 'active';
};