export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function retryNetworkOperation<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig: RetryConfig = {
    maxAttempts: config.maxAttempts ?? 3,
    initialDelayMs: config.initialDelayMs ?? 1000,
    maxDelayMs: config.maxDelayMs ?? 10000,
    backoffMultiplier: config.backoffMultiplier ?? 1.8,
  };
  let attempt = 0;
  let currentDelay = fullConfig.initialDelayMs;
  let lastError: unknown = new Error("Operation failed after all retries");
  while (attempt < fullConfig.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;
      if (attempt >= fullConfig.maxAttempts) {
        break;
      }
      const jitter = Math.random() * (currentDelay * 0.3);
      currentDelay = Math.min(currentDelay * fullConfig.backoffMultiplier + jitter, fullConfig.maxDelayMs);
      await sleep(currentDelay);
    }
  }
  throw lastError;
}
interface PlayerData {
  id: string;
  name: string;
  score: number;
  level: number;
}
async function mockApiCall(endpoint: string): Promise<PlayerData> {
  await sleep(200);
  const failChance = Math.random();
  if (failChance < 0.4) {
    throw new Error("Network failure in gaming server");
  }
  return { id: endpoint, name: "ProGamer42", score: 2450, level: 28 };
}
export async function getPlayerDataWithRetry(playerId: string, config?: Partial<RetryConfig>): Promise<PlayerData> {
  return retryNetworkOperation(() => mockApiCall(`/players/${playerId}`), config);
}
export class GamingNetworkClient {
  private retryConfig: RetryConfig;
  constructor(config?: Partial<RetryConfig>) {
    this.retryConfig = {
      maxAttempts: config?.maxAttempts ?? 4,
      initialDelayMs: config?.initialDelayMs ?? 500,
      maxDelayMs: config?.maxDelayMs ?? 8000,
      backoffMultiplier: config?.backoffMultiplier ?? 2,
    };
  }
  async fetchWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    return retryNetworkOperation(operation, this.retryConfig);
  }
  async getPlayerScore(playerId: string): Promise<number> {
    const data = await this.fetchWithRetry(() => mockApiCall(`/score/${playerId}`));
    return data.score;
  }
}