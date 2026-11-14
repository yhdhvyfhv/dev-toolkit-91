export type RetryConfig = { attempts: number; backoff: number };

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = { attempts: 3, backoff: 500 }
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < config.attempts; i++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (i < config.attempts - 1) {
        await new Promise((res) => setTimeout(res, config.backoff * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export const gamingFetch = async <T>(url: string, init?: RequestInit): Promise<T> => {
  return withRetry(async () => {
    const response = await fetch(url, init);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T>;
  });
};