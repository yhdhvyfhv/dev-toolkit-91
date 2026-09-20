export type Frame = number;
export type BufferKey = string | number;

export class ObjectPool<T> {
  private pool: T[] = [];
  constructor(private factory: () => T) {}
  acquire(): T {
    return this.pool.pop() ?? this.factory();
  }
  release(item: T): void {
    if (this.pool.length < 1000) this.pool.push(item);
  }
}

export interface MemorySlice {
  readonly buffer: ArrayBuffer;
  readonly offset: number;
  readonly length: number;
}

export type EngineState = {
  tick: Frame;
  cache: Map<BufferKey, Float32Array>;
  clean(): void;
};

export const createGameState = (capacity: number): EngineState => ({
  tick: 0,
  cache: new Map(),
  clean() {
    if (this.tick % 60 === 0) {
      this.cache.clear();
    }
    this.tick++;
  }
});