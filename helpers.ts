export class GameError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const safeInvoke = <T, R>(fn: (args: T) => R, fallback: R) => {
  return (args: T): R => {
    try {
      return fn(args);
    } catch (err) {
      console.error('[dev-toolkit-91] Execution fault:', err);
      return fallback;
    }
  };
};

export const assertEntity = <T>(entity: T | null | undefined, name: string): T => {
  if (!entity) {
    throw new GameError('ENTITY_MISSING', `Required entity ${name} is nullish`, { name });
  }
  return entity;
};

export const retryOperation = async <T>(
  op: () => Promise<T>,
  retries: number = 3,
  delay: number = 100
): Promise<T> => {
  try {
    return await op();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryOperation(op, retries - 1, delay * 2);
  }
};