export type RetryConfig = { attempts: number; delay: number };

export const withRetry = async <T>(
  operation: () => Promise<T>,
  { attempts, delay }: RetryConfig = { attempts: 3, delay: 1000 }
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        const jitter = Math.random() * 200;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }
  
  throw lastError;
};

export const fetchWithBackoff = async <T>(url: string, init?: RequestInit): Promise<T> => {
  return withRetry(async () => {
    const response = await fetch(url, init);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<T>;
  });
};