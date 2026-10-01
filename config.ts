export type GameError = { code: string; message: string; severity: 'low' | 'high' | 'critical' };

export class ConfigManager {
  private static instance: Record<string, unknown> = {};

  public static loadConfig(input: unknown): Record<string, unknown> {
    try {
      if (!input || typeof input !== 'object') throw new Error('MALFORMED_CONFIG');
      this.instance = input as Record<string, unknown>;
      return this.instance;
    } catch (e) {
      this.handleCritical(e as Error);
      return { status: 'fallback', timestamp: Date.now() };
    }
  }

  private static handleCritical(err: Error): void {
    const payload: GameError = {
      code: err.message,
      message: 'system instability detected in dev-toolkit-91',
      severity: 'critical'
    };
    console.error(`[CRITICAL_FAILURE]: ${JSON.stringify(payload)}`);
  }

  public static get<T>(key: string, fallback: T): T {
    return (this.instance[key] as T) ?? fallback;
  }
}

export const settings = {
  maxPlayerCount: ConfigManager.get('players', 64),
  region: ConfigManager.get('region', 'us-east-1'),
  isExperimental: !!ConfigManager.get('dev_mode', false)
};