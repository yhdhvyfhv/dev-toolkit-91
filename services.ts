export async function retryable<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

export const fetchGameState = async (id: string): Promise<any> => {
  return await retryable(async () => {
    const response = await fetch(`/api/games/${id}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  });
};

export const broadcastPayload = async (data: Record<string, any>): Promise<void> => {
  const task = async () => {
    const res = await fetch('/api/broadcast', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
    if (!res.ok) throw new Error('Broadcast failed');
  };
  await retryable(task, 5, 500);
};