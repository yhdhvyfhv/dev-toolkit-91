export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 1.5);
  }
}

export const gameNetworkRequest = async <T>(task: () => Promise<T>) => {
  const signal = new AbortController();
  const timeout = setTimeout(() => signal.abort(), 10000);

  try {
    return await retryWithBackoff(async () => {
      const result = await task();
      return result;
    });
  } catch (err) {
    console.error('[dev-toolkit-91] network operation failed:', err);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};