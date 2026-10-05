export type RetryableTask<T> = () => Promise<T>;

export interface RetryConfig {
  attempts: number;
  delayMs: number;
  backoffFactor: number;
}

export const withRetry = async <T>(
  task: RetryableTask<T>,
  config: RetryConfig = { attempts: 3, delayMs: 500, backoffFactor: 2 }
): Promise<T> => {
  let lastError: unknown;
  let currentDelay = config.delayMs;

  for (let i = 0; i < config.attempts; i++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (i < config.attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= config.backoffFactor;
      }
    }
  }

  throw lastError instanceof Error 
    ? new Error(`failed after ${config.attempts} attempts: ${lastError.message}`) 
    : lastError;
};

export const wrapNetworkCall = <T>(fn: (...args: any[]) => Promise<T>) => {
  return (...args: Parameters<typeof fn>): Promise<T> => 
    withRetry(() => fn(...args));
};