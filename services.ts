export type RetryConfig = {
  maxAttempts: number;
  delayMs: number;
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  config: RetryConfig = { maxAttempts: 3, delayMs: 1000 }
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt === config.maxAttempts) break;
      await new Promise((resolve) => setTimeout(resolve, config.delayMs * attempt));
    }
  }

  throw lastError;
};

export const fetchGameState = async (id: string): Promise<any> => {
  return withRetry(async () => {
    const response = await fetch(`/api/v1/game/${id}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  });
};