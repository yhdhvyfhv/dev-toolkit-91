export type GameTick = number;

export interface PerformanceBuffer<T> {
  data: Float64Array;
  cursor: number;
  readonly capacity: number;
  push(val: T): void;
  mean(): number;
}

export class RollingLatencyMonitor implements PerformanceBuffer<number> {
  public data: Float64Array;
  public cursor: number = 0;

  constructor(public readonly capacity: number = 1024) {
    this.data = new Float64Array(capacity);
  }

  push(val: number): void {
    this.data[this.cursor] = val;
    this.cursor = (this.cursor + 1) % this.capacity;
  }

  mean(): number {
    let sum = 0;
    for (let i = 0; i < this.capacity; i++) {
      sum += this.data[i];
    }
    return sum / this.capacity;
  }
}

export type MemorySnapshot = {
  heapUsed: number;
  tickRate: GameTick;
  timestamp: number;
};

export const optimizeBuffer = (size: number): Float64Array => new Float64Array(size);

export const fastAverage = (buffer: Float64Array): number => {
  const len = buffer.length;
  let total = 0;
  for (let i = 0; i < len; i += 4) {
    total += buffer[i] + (buffer[i + 1] || 0) + (buffer[i + 2] || 0) + (buffer[i + 3] || 0);
  }
  return total / len;
};