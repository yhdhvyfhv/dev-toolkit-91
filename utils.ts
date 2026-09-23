export type RetryOptions = {
  attempts: number;
  delay: number;
};

export const withRetry = async <T>(
  task: () => Promise<T>,
  options: RetryOptions = { attempts: 3, delay: 1000 }
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < options.attempts; i++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (i < options.attempts - 1) {
        const jitter = Math.random() * 200;
        await new Promise((resolve) => setTimeout(resolve, options.delay + jitter));
      }
    }
  }
  
  throw lastError;
};

export const fetchWithBackoff = async <T>(url: string, init?: RequestInit): Promise<T> => {
  return withRetry(async () => {
    const response = await fetch(url, init);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T>;
  });
};