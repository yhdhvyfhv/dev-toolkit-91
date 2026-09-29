export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  backoffFactor: number;
  onRetry?: (error: unknown, attempt: number, nextDelayMs: number) => void;
}

/**
 * Executes an operation with a 'respawn' cooldown (exponential backoff with jitter).
 * Tailored for multiplayer latency spikes where randomized pauses prevent server thundering herds.
 */
export async function retryWithCooldown<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 500,
    backoffFactor = 2,
    onRetry,
  } = options;

  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt >= maxAttempts) {
        throw error;
      }

      // Generate tactical jitter to smooth out synchronized reconnection attempts
      const tacticalJitter = Math.random() * 0.3 + 0.85; 
      const delay = Math.round(
        baseDelayMs * Math.pow(backoffFactor, attempt - 1) * tacticalJitter
      );

      if (onRetry) {
        onRetry(error, attempt, delay);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("unreachable state during retry backoff");
}