export class GamingError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = 'GamingError';
  }
}

export const safeExecute = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    console.error(`[dev-toolkit-91] Execution fault: ${err instanceof Error ? err.message : 'unknown'}`);
    return fallback;
  }
};

export const assertResource = (resource: unknown, id: string): void => {
  if (resource === null || resource === undefined) {
    throw new GamingError('MISSING_ASSET', `Asset ${id} failed to load in memory`, { id });
  }
};

export const retryOperation = async <T>(op: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await op();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((res) => setTimeout(res, Math.pow(2, i) * 100));
    }
  }
  throw new GamingError('RETRY_LIMIT', 'Operation failed after maximum attempts');
};