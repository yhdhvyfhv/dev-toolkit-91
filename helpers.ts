export interface RetryOptions {
  maxAttempts?: number;
  baseCooldownMs?: number;
  criticalJitter?: boolean;
  onRetryCallback?: (attempt: number, delay: number, error: unknown) => void;
}

/**
 * Executes a game network operation using dynamic RPG-styled backoff cooldowns.
 * Designed for high-frequency multiplayer state sync and telemetry retries.
 */
export async function withRpgBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 5,
    baseCooldownMs = 120,
    criticalJitter = true,
    onRetryCallback,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;

      // Exponential backoff modified by a gaming 'critical luck' speedup chance
      const expDelay = baseCooldownMs * Math.pow(2, attempt - 1);
      const isCriticalHit = criticalJitter && Math.random() < 0.2;
      const jitter = isCriticalHit ? 0.25 : 0.75 + Math.random() * 0.5;
      const cooldownMs = Math.floor(expDelay * jitter);

      if (onRetryCallback) {
        onRetryCallback(attempt, cooldownMs, err);
      }

      await new Promise((resolve) => setTimeout(resolve, cooldownMs));
    }
  }

  throw new Error(
    `[DevToolkit91] Packet dispatch failed after ${maxAttempts} attempts. Reason: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}