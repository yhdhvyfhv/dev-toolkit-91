type CacheEntry<T> = { val: T; expires: number };

const LRU_LIMIT = 500;
const cache = new Map<string, CacheEntry<any>>();

export const getOptimizedState = <T>(key: string, fetcher: () => T, ttl: number = 5000): T => {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && cached.expires > now) {
    return cached.val as T;
  }

  if (cache.size >= LRU_LIMIT) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  const fresh = fetcher();
  cache.set(key, { val: fresh, expires: now + ttl });
  return fresh;
};

export const clearExpiredCache = (): void => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expires < now) cache.delete(key);
  }
};

export const gameConfig = Object.freeze({
  tickRate: 60,
  physicsPrecision: 0.001,
  enableInterpolation: true,
  renderDistance: 1024,
});