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
    console.error(`[dev-toolkit-91] engine failure: ${err instanceof Error ? err.message : 'unknown'}`);
    return fallback;
  }
};

export const assertState = (condition: boolean, msg: string, context?: Record<string, unknown>): void => {
  if (!condition) {
    throw new GameError('STATE_VIOLATION', msg, context);
  }
};

export const recoverState = async <T>(task: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await task();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 100));
    }
  }
  throw new GameError('RECOVERY_FAILED', 'exhausted retries');
};