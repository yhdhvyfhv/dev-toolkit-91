export interface RetryOptions {
  maxRespawns?: number;
  initialCooldownMs?: number;
  cooldownMultiplier?: number;
  maxCooldownMs?: number;
  jitter?: boolean;
  onRespawnAttempt?: (attempt: number, delay: number, lastError: Error) => void;
}

export async function retryNetworkOp<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRespawns = 3,
    initialCooldownMs = 250,
    cooldownMultiplier = 2,
    maxCooldownMs = 5000,
    jitter = true,
    onRespawnAttempt,
  } = options;

  let currentAttempt = 0;

  while (true) {
    try {
      return await operation(currentAttempt);
    } catch (error) {
      currentAttempt++;
      if (currentAttempt > maxRespawns) {
        const errMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Operation game over after ${maxRespawns} respawns: ${errMessage}`);
      }

      let delay = initialCooldownMs * Math.pow(cooldownMultiplier, currentAttempt - 1);
      delay = Math.min(delay, maxCooldownMs);

      if (jitter) {
        const rngFactor = 0.85 + Math.random() * 0.3;
        delay = Math.floor(delay * rngFactor);
      }

      if (onRespawnAttempt) {
        onRespawnAttempt(currentAttempt, delay, error instanceof Error ? error : new Error(String(error)));
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}