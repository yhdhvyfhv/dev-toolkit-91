export async function withRetry<T>(task: () => Promise<T>, attempts: number = 3, delay: number = 1000): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export const fetchGameData = async <T>(url: string): Promise<T> => {
  return withRetry(async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T>;
  });
};

export const broadcastPayload = async (data: Record<string, any>): Promise<void> => {
  await withRetry(async () => {
    const res = await fetch('/api/telemetry', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Broadcast failed');
  }, 5, 500);
};