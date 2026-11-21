interface PerformanceConfig {
  frameBudgetMs: number;
  cacheLimit: number;
  isAggressivePruningEnabled: boolean;
}

export const engineConfig: PerformanceConfig = {
  frameBudgetMs: 16.67,
  cacheLimit: 1024,
  isAggressivePruningEnabled: true
};

export const getMemoryPoolSize = (base: number): number => {
  const multiplier = typeof window !== 'undefined' && (window.navigator as any).deviceMemory || 4;
  return Math.floor(base * Math.min(multiplier, 8));
};

export class DynamicBufferManager {
  private buffer: Float32Array;
  constructor(size: number) {
    this.buffer = new Float32Array(getMemoryPoolSize(size));
  }
  
  public getSlice(offset: number, length: number): Float32Array {
    return this.buffer.subarray(offset, offset + length);
  }

  public flush(): void {
    this.buffer.fill(0);
  }
}

export const frameThrottle = <T extends (...args: any[]) => void>(fn: T, limit: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};