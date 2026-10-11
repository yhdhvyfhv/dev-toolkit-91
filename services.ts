export class GamingEngineError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = 'GamingEngineError';
  }
}

export const safeExecute = async <T>(task: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await task();
  } catch (error) {
    const err = error as GamingEngineError;
    console.error(`[dev-toolkit-91] Critical failure in ${err.code}:`, err.message);
    return fallback;
  }
};

export const validateGameState = (state: unknown): boolean => {
  if (!state || typeof state !== 'object') {
    throw new GamingEngineError('INVALID_STATE', 'State payload is corrupted or null');
  }
  return true;
};

export const retryOperation = async <T>(op: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await op();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 100));
    }
  }
  throw new GamingEngineError('RETRY_LIMIT_EXCEEDED', 'Max attempts reached for engine operation');
};