export type RetryOptions = {
  maxAttempts: number;
  delayMs: number;
};

export const withRetry = async <T>(
  task: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, delayMs: 1000 }
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (attempt === options.maxAttempts) break;
      
      const jitter = Math.random() * 200;
      await new Promise((res) => setTimeout(res, options.delayMs + jitter));
    }
  }

  throw lastError;
};

export const networkOperation = async <T>(fn: () => Promise<T>): Promise<T> => {
  return withRetry(fn, { maxAttempts: 5, delayMs: 500 });
};