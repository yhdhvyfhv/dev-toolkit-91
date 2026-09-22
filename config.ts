export type GameError = { code: string; severity: 'low' | 'critical'; trace: string[] };

export class ConfigSanitizer {
  public static validate<T>(input: unknown, fallback: T): T {
    try {
      if (!input || typeof input !== 'object') throw new Error('invalid_structure');
      return input as T;
    } catch (e) {
      this.report(e as Error);
      return fallback;
    }
  }

  private static report(err: Error): void {
    const payload: GameError = {
      code: err.message,
      severity: 'critical',
      trace: [new Error().stack?.split('\n')[3]?.trim() || 'unknown_origin']
    };
    console.error(`[dev-toolkit-91] logic failure: ${JSON.stringify(payload)}`);
  }
}

export const ENV_CONFIG = {
  maxFrameBuffer: ConfigSanitizer.validate(process.env.BUFFER_SIZE, 60),
  isDevMode: process.env.NODE_ENV !== 'production',
  getFallback: <T>(val: T | undefined, def: T): T => (val !== undefined ? val : def)
};