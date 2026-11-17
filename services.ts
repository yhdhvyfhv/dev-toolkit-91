export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

export const fetchGameData = async (endpoint: string): Promise<any> => {
  const task = async () => {
    const response = await fetch(`https://api.dev-toolkit-91.io/${endpoint}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  };

  return retryWithBackoff(task);
};