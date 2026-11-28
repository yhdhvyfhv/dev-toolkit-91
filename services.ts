export class GameNetworkError extends Error { constructor(public code: string, message: string) { super(message); this.name = 'GameNetworkError'; } }

export const safeExecute = async <T>(task: () => Promise<T>, retries: number = 3): Promise<T | null> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await task();
    } catch (err) {
      if (attempt === retries) {
        console.error(`[dev-toolkit-91] Critical failure on attempt ${attempt}:`, err);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
  return null;
};

export const parseGameState = (data: unknown): Record<string, any> => {
  try {
    if (typeof data !== 'string') throw new Error('Invalid payload');
    const parsed = JSON.parse(data);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return { status: 'corrupted', timestamp: Date.now() };
  }
};