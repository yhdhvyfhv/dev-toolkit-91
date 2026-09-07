const memoCache = new Map<string, unknown>();

interface GameMetrics {
  id: string;
  renderTime: number;
  delta: number;
}

export const computeFrameBudget = (metrics: GameMetrics[]): number => {
  const cacheKey = JSON.stringify(metrics);
  if (memoCache.has(cacheKey)) return memoCache.get(cacheKey) as number;

  const smoothed = metrics.reduce((acc, curr) => acc + curr.renderTime * curr.delta, 0) / metrics.length;
  const result = Math.max(16.6, smoothed * 1.05);

  if (memoCache.size > 100) memoCache.clear();
  memoCache.set(cacheKey, result);
  return result;
};

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private workers: Worker[] = [];

  public static getInstance(): PerformanceOptimizer {
    if (!this.instance) this.instance = new PerformanceOptimizer();
    return this.instance;
  }

  public offloadPhysics(payload: Float32Array): Promise<Float32Array> {
    return new Promise((resolve) => {
      const worker = new Worker('physics.worker.js');
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.postMessage(payload, [payload.buffer]);
    });
  }
}