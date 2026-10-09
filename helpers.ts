export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  multiplier: number;
  chaosPercent: number;
}

/**
 * Executes an async network operation with chaotic exponential backoff.
 * Helps prevent game client synchronization storms (thundering herd problem).
 */
export async function resurrectNetworkCall<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries = 4, initialDelay = 150, multiplier = 2, chaosPercent = 30 } = config;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;

      const baseDelay = initialDelay * Math.pow(multiplier, attempt - 1);
      const chaosVariance = baseDelay * (chaosPercent / 100);
      const jitter = (Math.random() * 2 - 1) * chaosVariance;
      const actualDelay = Math.max(0, baseDelay + jitter);

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Network operation failed after ${maxRetries} attempts. Reason: ${message}`);
}