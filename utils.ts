export type RetryOptions = { maxRetries: number; baseDelay: number };

export const withExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  { maxRetries = 3, baseDelay = 1000 }: RetryOptions = { maxRetries: 3, baseDelay: 1000 }
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      
      const jitter = Math.random() * 200;
      const delay = Math.pow(2, attempt) * baseDelay + jitter;
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError instanceof Error 
    ? new Error(`network failure after ${maxRetries} retries: ${lastError.message}`) 
    : lastError;
};

export const fetchWithGamingTimeout = async (url: string, timeoutMs: number = 5000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};