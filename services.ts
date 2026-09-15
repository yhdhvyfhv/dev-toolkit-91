export async function withRetry<T>(
  task: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;
      const jitter = Math.random() * 200;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt + jitter));
    }
  }
  throw lastError;
}

export const fetchGameState = async (id: string): Promise<any> => {
  return withRetry(async () => {
    const response = await fetch(`/api/game/${id}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  });
};

export const broadcastAction = async (payload: object): Promise<boolean> => {
  return withRetry(async () => {
    const res = await fetch('/api/broadcast', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    return res.ok;
  }, 5, 500);
};