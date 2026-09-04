export class GameError extends Error {
  constructor(public code: string, public context: Record<string, unknown>) {
    super(`[${code}] Execution fault in dev-toolkit-91`);
    Object.setPrototypeOf(this, GameError.prototype);
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    console.error('Recovering from chaotic state:', err);
    return fallback;
  }
};

export const assertEntity = <T>(entity: T | null | undefined, id: string): T => {
  if (!entity) {
    throw new GameError('ENTITY_VOID', { target: id, timestamp: Date.now() });
  }
  return entity;
};

export async function retryable<T>(task: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 100));
    }
  }
  throw new GameError('RETRY_EXHAUSTED', { attempts });
}