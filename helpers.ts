type CacheEntry<T> = { val: T; expiry: number };

const memoMap = new Map<string, CacheEntry<unknown>>();

export const optimizeGameFrame = <T>(key: string, fn: () => T, ttl: number = 16): T => {
  const now = Date.now();
  const cached = memoMap.get(key);

  if (cached && cached.expiry > now) {
    return cached.val as T;
  }

  const result = fn();
  memoMap.set(key, { val: result, expiry: now + ttl });
  return result;
};

export const batchProcess = <T, R>(items: T[], fn: (batch: T[]) => R[], size: number = 32): R[] => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    results.push(...fn(items.slice(i, i + size)));
  }
  return results;
};

export const fastIdentity = <T>(input: T): T => {
  return JSON.parse(JSON.stringify(input));
};

export const purgeStaleCache = (): void => {
  const now = Date.now();
  for (const [key, entry] of memoMap.entries()) {
    if (entry.expiry <= now) {
      memoMap.delete(key);
    }
  }
};