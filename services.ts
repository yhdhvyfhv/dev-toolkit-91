export async function retryWithBackoff<T>(fn: () => Promise<T>, attempts: number = 3, delay: number = 500): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, attempts - 1, delay * 2);
  }
}

export const fetchGameState = async (id: string): Promise<any> => {
  return retryWithBackoff(async () => {
    const response = await fetch(`/api/game/${id}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  });
};

export const executeAction = async <T>(action: () => Promise<T>): Promise<T> => {
  const startTime = Date.now();
  try {
    return await retryWithBackoff(action);
  } finally {
    console.debug(`network transaction took ${Date.now() - startTime}ms`);
  }
};