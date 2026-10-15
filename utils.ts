export type RetryOptions = { maxRetries: number; baseDelay: number };

export const withRetry = async <T>(
  fn: () => Promise<T>,
  { maxRetries = 3, baseDelay = 500 }: RetryOptions = { maxRetries: 3, baseDelay: 500 }
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      
      const jitter = Math.random() * 200;
      const delay = baseDelay * Math.pow(2, attempt) + jitter;
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError instanceof Error 
    ? new Error(`network failure after ${maxRetries} attempts: ${lastError.message}`) 
    : lastError;
};

export const gameFetch = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  return withRetry(async () => {
    const response = await fetch(input, init);
    if (!response.ok) throw new Error(`http status ${response.status}`);
    return response.json() as Promise<T>;
  });
};