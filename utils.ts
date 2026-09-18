export class GameError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    Object.setPrototypeOf(this, GameError.prototype);
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    console.error('[dev-toolkit-91] Caught instability:', err);
    return fallback;
  }
};

export const assertGameState = (condition: boolean, msg: string, context?: Record<string, unknown>): void => {
  if (!condition) {
    throw new GameError('INVALID_STATE', msg, context);
  }
};

export const retryOperation = async <T>(op: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await op();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 100));
    }
  }
  throw new GameError('MAX_RETRIES_EXCEEDED', 'Operation failed after retries');
};