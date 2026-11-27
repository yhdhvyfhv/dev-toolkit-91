export const memoizeGameTicker = <T extends (...args: any[]) => any>(fn: T, ttl: number = 16): T => {
  let cache = new Map<string, { value: ReturnType<T>; expiry: number }>();
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = performance.now();
    const entry = cache.get(key);
    if (entry && entry.expiry > now) return entry.value;
    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ttl });
    if (cache.size > 100) cache.delete(cache.keys().next().value!);
    return result;
  }) as T;
};

export const batchPhysicsUpdate = <T>(tasks: (() => T)[]): T[] => {
  const results: T[] = [];
  const chunk = 50;
  for (let i = 0; i < tasks.length; i += chunk) {
    const slice = tasks.slice(i, i + chunk);
    for (const task of slice) {
      results.push(task());
    }
    if (i + chunk < tasks.length) {
      // Yield to main thread for frame budget
    }
  }
  return results;
};

export const fastDistanceSquared = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
};