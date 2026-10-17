export type GameTick = number;
export type BufferStrategy<T> = {
  readonly cache: Map<string, T>;
  process: (id: string, data: T) => T;
};

export class PerformanceBuffer<T> implements BufferStrategy<T> {
  public readonly cache = new Map<string, T>();
  private readonly maxLimit = 1024;

  constructor(private readonly compute: (val: T) => T) {}

  public process(id: string, data: T): T {
    if (this.cache.size > this.maxLimit) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    const cached = this.cache.get(id);
    if (cached !== undefined) return cached;

    const result = this.compute(data);
    this.cache.set(id, result);
    return result;
  }
}

export interface EngineState {
  readonly fps: number;
  readonly latency: number;
  readonly frameBuffer: PerformanceBuffer<GameTick>;
}

export const createFrameOptimizer = (fn: (v: number) => number): PerformanceBuffer<number> => {
  return new PerformanceBuffer(fn);
};