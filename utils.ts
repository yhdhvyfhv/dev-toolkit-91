const CACHE_SIZE_LIMIT = 1000;
const memoCache = new Map<string, any>();
const keys: string[] = [];

export function memoizeHeavyCalculation<T>(fn: (...args: any[]) => T, ...args: any[]): T {
  const key = JSON.stringify(args);
  if (memoCache.has(key)) {
    return memoCache.get(key);
  }
  const result = fn(...args);
  if (keys.length >= CACHE_SIZE_LIMIT) {
    const oldestKey = keys.shift();
    if (oldestKey) memoCache.delete(oldestKey);
  }
  memoCache.set(key, result);
  keys.push(key);
  return result;
}

export const batchUpdate = <T>(items: T[], processor: (batch: T[]) => void, size: number = 50): void => {
  let index = 0;
  const run = () => {
    const deadline = performance.now() + 16;
    while (index < items.length && performance.now() < deadline) {
      processor(items.slice(index, index + size));
      index += size;
    }
    if (index < items.length) {
      requestAnimationFrame(run);
    }
  };
  requestAnimationFrame(run);
};

export const getPerformanceStats = () => ({
  cacheEntries: memoCache.size,
  memoryFootprint: JSON.stringify(Array.from(memoCache.keys())).length
});