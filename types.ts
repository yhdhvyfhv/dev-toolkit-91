export type GameState = 'active' | 'paused' | 'error' | 'loading';

export class GamingEngineError extends Error {
  constructor(public code: number, message: string, public recoveryData?: unknown) {
    super(`[Code ${code}] ${message}`);
    Object.setPrototypeOf(this, GamingEngineError.prototype);
  }
}

export const catchBoundary = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    console.error('Recovering from edge state:', err);
    return fallback;
  }
};

export interface AsyncResult<T> {
  value: T | null;
  error: GamingEngineError | null;
}

export const safeExecute = async <T>(task: () => Promise<T>, defaultValue: T): Promise<AsyncResult<T>> => {
  try {
    return { value: await task(), error: null };
  } catch (e) {
    const err = e instanceof GamingEngineError ? e : new GamingEngineError(500, 'Unmapped panic');
    return { value: defaultValue, error: err };
  }
};

export const assertDomain = (val: number, min: number, max: number): number => {
  return val < min ? min : val > max ? max : val;
};