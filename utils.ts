const memoize = <T, R>(fn: (arg: T) => R): (arg: T) => R => {
  const cache = new Map<T, R>();
  return (arg: T) => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};

export const batchProcess = <T>(items: T[], chunkSize: number = 64): T[][] => {
  return Array.from({ length: Math.ceil(items.length / chunkSize) }, (_, i) =>
    items.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
};

export const entityHash = memoize((entityId: string): number => {
  let hash = 0;
  for (let i = 0; i < entityId.length; i++) {
    hash = (hash << 5) - hash + entityId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
});

export class PerformanceBuffer {
  private pool: Float32Array[] = [];
  constructor(private size: number, private capacity: number) {}

  allocate(): Float32Array {
    return this.pool.pop() || new Float32Array(this.size);
  }

  recycle(buffer: Float32Array): void {
    if (this.pool.length < this.capacity) {
      this.pool.push(buffer);
    }
  }
}