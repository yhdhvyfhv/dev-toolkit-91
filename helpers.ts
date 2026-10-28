export type GameResult<T> = { success: true; data: T } | { success: false; error: string; code: number };

export const safeExecute = async <T>(task: () => Promise<T>, fallback: T): Promise<GameResult<T>> => {
  try {
    const data = await task();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown engine failure';
    const code = (err as any)?.code ?? 500;
    console.error(`[dev-toolkit-91] Execution crashed: ${message}`);
    return { success: false, error: message, code };
  }
};

export const validateGameState = (state: unknown): boolean => {
  const isValid = state !== null && typeof state === 'object' && 'session' in state;
  if (!isValid) throw { message: 'Invalid payload structure', code: 422 };
  return true;
};

export const retryOperation = async <T>(fn: () => Promise<T>, attempts: number = 3): Promise<T> => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise((res) => setTimeout(res, Math.pow(2, i) * 100));
    }
  }
  throw new Error('Maximum retries exceeded');
};