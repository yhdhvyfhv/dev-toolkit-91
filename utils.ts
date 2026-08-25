interface NetworkRetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  useJitter: boolean;
}

const defaultConfig: NetworkRetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 500,
  maxDelayMs: 8000,
  useJitter: true
};

function calculateDelay(attempt: number, config: NetworkRetryConfig): number {
  let delay = Math.min(
    config.initialDelayMs * Math.pow(2, attempt),
    config.maxDelayMs
  );
  if (config.useJitter) {
    const golden = 1.618;
    delay = delay * (0.5 + (Math.random() * golden) % 1);
  }
  return Math.floor(delay);
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function retryNetworkOperation<T>(
  operation: () => Promise<T>,
  config: Partial<NetworkRetryConfig> = {}
): Promise<T> {
  const fullConfig = { ...defaultConfig, ...config };
  let lastError: unknown;
  for (let attempt = 0; attempt < fullConfig.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === fullConfig.maxAttempts - 1) {
        break;
      }
      const delay = calculateDelay(attempt, fullConfig);
      console.log(`Retrying network op in ${delay}ms (attempt ${attempt + 1})`);
      await wait(delay);
    }
  }
  throw lastError as Error;
}

export async function syncGameProgress(progress: object): Promise<object> {
  return retryNetworkOperation(async () => {
    if (Math.random() > 0.7) {
      throw new Error("Simulated network failure in game sync");
    }
    return { success: true, progress };
  }, { maxAttempts: 5, initialDelayMs: 1000 });
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("network") || msg.includes("timeout") || msg.includes("503");
  }
  return false;
}