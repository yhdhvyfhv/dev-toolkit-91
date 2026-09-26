export type RetryableTask<T> = () => Promise<T>;

interface RetryOptions {
  attempts: number;
  delayMs: number;
  backoffFactor: number;
}

export const withExponentialRetry = async <T>(
  task: RetryableTask<T>,
  options: RetryOptions = { attempts: 3, delayMs: 500, backoffFactor: 2 }
): Promise<T> => {
  let lastError: unknown;
  let currentDelay = options.delayMs;

  for (let i = 0; i < options.attempts; i++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (i === options.attempts - 1) break;
      
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= options.backoffFactor;
    }
  }

  throw new Error(`Task failed after ${options.attempts} attempts: ${lastError}`);
};

export const fetchWithGamingHeaders = async (url: string): Promise<Response> => {
  return withExponentialRetry(async () => {
    const response = await fetch(url, {
      headers: { 'X-Dev-Toolkit-Version': '91', 'X-Gaming-Platform': 'web' }
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response;
  });
};