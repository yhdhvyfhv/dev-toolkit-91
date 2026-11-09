export class GameError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = 'GameError';
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    console.error(`[dev-toolkit-91] Silencing edge case error: ${err instanceof Error ? err.message : 'Unknown'}`);
    return fallback;
  }
};

export const validateGameState = (state: unknown): boolean => {
  if (state === null || typeof state !== 'object') {
    throw new GameError('INVALID_STATE', 'State must be an object', { received: typeof state });
  }
  return true;
};

export const wrapAsync = <T>(promise: Promise<T>): Promise<[T | null, Error | null]> => {
  return promise
    .then((data): [T, null] => [data, null])
    .catch((err): [null, Error] => [null, err instanceof Error ? err : new Error(String(err))]);
};

export const retryOperation = async <T>(op: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await op();
    } catch (e) {
      if (i === retries - 1) throw e;
    }
  }
  throw new GameError('RETRIES_EXHAUSTED', 'Operation failed after retries');
};