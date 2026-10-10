export type RetryConfig = {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = { maxAttempts: 3, delayMs: 500, backoffFactor: 2 }
): Promise<T> {
  let lastError: unknown;
  let currentDelay = config.delayMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt === config.maxAttempts) break;

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= config.backoffFactor;
    }
  }

  throw lastError;
}

export const gamingExponentialBackoff = (attempt: number): number => 
  Math.pow(2, attempt) * 100 + Math.random() * 50;