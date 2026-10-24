export type GlitchContext = {
  tick: number;
  subsystem: string;
  error: Error;
};

export type RecoveryAction<T> = (err: Error, context: GlitchContext) => T | null;

export class FrameBoundaryGuard {
  private tickCount = 0;
  private glitchLog: GlitchContext[] = [];

  constructor(private readonly maxHistory: number = 50) {}

  public executeFrameStep<T>(
    subsystem: string,
    stepFn: () => T,
    recovery: RecoveryAction<T>,
    fallback: T
  ): T {
    this.tickCount++;
    try {
      const result = stepFn();
      if (result === undefined || result === null || (typeof result === 'number' && Number.isNaN(result))) {
        throw new Error(`Invalid evaluation output: ${String(result)}`);
      }
      return result;
    } catch (err) {
      const glitch: GlitchContext = {
        tick: this.tickCount,
        subsystem,
        error: err instanceof Error ? err : new Error(String(err))
      };

      if (this.glitchLog.length >= this.maxHistory) {
        this.glitchLog.shift();
      }
      this.glitchLog.push(glitch);

      const recovered = recovery(glitch.error, glitch);
      return recovered !== null ? recovered : fallback;
    }
  }

  public getGlitchHistory(): readonly GlitchContext[] {
    return Object.freeze([...this.glitchLog]);
  }
}