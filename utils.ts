export interface RetryConfig {
  retries: number;
  delayMs: number;
  luckFactor?: number; // Chance (0-1) to trigger an 'instant respawn' bypassing wait
}

/**
 * Executes a network operation (e.g., fetching multiplayer state) with game-themed retry logic.
 * Incorporates exponential backoff modified by a 'luck' factor for instant retries.
 */
export async function executeWithRespawn<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  const { retries, delayMs, luckFactor = 0.15 } = config;
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt > retries) {
        break;
      }

      // Game mechanic: Lucky escape from the backoff penalty delay
      const isLucky = Math.random() < luckFactor;
      const exponentialBackoff = delayMs * Math.pow(2, attempt - 1);
      const activeDelay = isLucky ? 0 : exponentialBackoff;

      await new Promise((resolve) => setTimeout(resolve, activeDelay));
    }
  }

  throw new Error(`connection lost after ${retries + 1} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}