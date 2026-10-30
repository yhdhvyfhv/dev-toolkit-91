export type GameTick = number;
export type EntityId = string | number;

export interface PerformanceBuffer<T> {
  data: Float64Array;
  cursor: number;
  capacity: number;
  push: (val: number) => void;
  getAverage: () => number;
}

export class TickTracker implements PerformanceBuffer<number> {
  public data: Float64Array;
  public cursor: number = 0;

  constructor(public capacity: number = 60) {
    this.data = new Float64Array(capacity);
  }

  push(val: number): void {
    this.data[this.cursor] = val;
    this.cursor = (this.cursor + 1) % this.capacity;
  }

  getAverage(): number {
    let sum = 0;
    for (let i = 0; i < this.capacity; i++) {
      sum += this.data[i];
    }
    return sum / this.capacity;
  }
}

export type MemorySnapshot = {
  heapUsed: number;
  timestamp: GameTick;
  pressure: 'low' | 'medium' | 'high';
};

export const getMemoryProfile = (usage: number): MemorySnapshot => ({
  heapUsed: usage,
  timestamp: Date.now(),
  pressure: usage > 0.8 ? 'high' : usage > 0.5 ? 'medium' : 'low'
});