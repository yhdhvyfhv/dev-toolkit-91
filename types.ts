export type GameTick = number;

export interface PerformanceBuffer<T> {
  data: T[];
  capacity: number;
  cursor: number;
  push: (val: T) => void;
  flush: () => T[];
}

export const createRingBuffer = <T>(capacity: number): PerformanceBuffer<T> => ({
  data: new Array(capacity),
  capacity,
  cursor: 0,
  push(val: T) {
    this.data[this.cursor] = val;
    this.cursor = (this.cursor + 1) % this.capacity;
  },
  flush() {
    const snapshot = [...this.data.filter(Boolean)];
    this.cursor = 0;
    this.data.fill(undefined as any);
    return snapshot;
  }
});

export type EngineMetrics = {
  fps: number;
  latency: number;
  memoryDelta: number;
};

export class MemoizedRegistry {
  private cache = new Map<string, unknown>();
  
  public get<T>(key: string, producer: () => T): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, producer());
    }
    return this.cache.get(key) as T;
  }

  public clear(): void {
    this.cache.clear();
  }
}