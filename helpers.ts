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

export const assertPlayerState = (state: unknown): asserts state is { id: string } => {
  if (!state || typeof state !== 'object' || !('id' in state)) {
    throw new GamingError('INVALID_STATE', 'Player state corruption detected', { state });
  }
};

export const robustFetch = async <T>(url: string, retries = 3): Promise<T | null> => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) return null;
      await new Promise(r => setTimeout(r, 100 * Math.pow(2, i)));
    }
  }
  return null;
};