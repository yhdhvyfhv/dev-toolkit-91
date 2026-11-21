export type RetryConfig = {
  maxAttempts: number;
  backoffMs: number;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxAttempts: 3, backoffMs: 500 }
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === config.maxAttempts) break;
      const jitter = Math.random() * 100;
      await new Promise((resolve) => 
        setTimeout(resolve, config.backoffMs * Math.pow(2, attempt - 1) + jitter)
      );
    }
  }
  throw lastError;
}

export const gamingNetworkWrapper = <T>(op: () => Promise<T>) => 
  withRetry(op, { maxAttempts: 5, backoffMs: 200 });