type CacheEntry<T> = { value: T; expiry: number };

const memoMap = new Map<string, CacheEntry<unknown>>();

export const memoizeTask = <T>(key: string, task: () => T, ttl: number = 5000): T => {
  const now = Date.now();
  const cached = memoMap.get(key);

  if (cached && cached.expiry > now) {
    return cached.value as T;
  }

  const result = task();
  memoMap.set(key, { value: result, expiry: now + ttl });
  return result;
};

export const batchProcess = <T, R>(items: T[], fn: (batch: T[]) => R[], chunkSize: number = 100): R[] => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    results.push(...fn(items.slice(i, i + chunkSize)));
  }
  return results;
};

export const throttleExecution = <F extends (...args: any[]) => any>(func: F, limit: number) => {
  let lastRan: number;
  return (...args: Parameters<F>): ReturnType<F> | undefined => {
    const now = Date.now();
    if (!lastRan || (now - lastRan) >= limit) {
      lastRan = now;
      return func(...args);
    }
  };
};