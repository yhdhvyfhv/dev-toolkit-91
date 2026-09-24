type CacheEntry<T> = { value: T; expiry: number };

const memoMap = new Map<string, CacheEntry<any>>();

export function memoizeHeavyCompute<T>(key: string, compute: () => T, ttl: number = 5000): T {
  const now = Date.now();
  const entry = memoMap.get(key);

  if (entry && entry.expiry > now) {
    return entry.value;
  }

  const result = compute();
  memoMap.set(key, { value: result, expiry: now + ttl });
  
  if (memoMap.size > 100) {
    const firstKey = memoMap.keys().next().value;
    memoMap.delete(firstKey);
  }

  return result;
}

export function batchUpdateProcess<T>(items: T[], processor: (batch: T[]) => void, chunkSize: number = 10): void {
  let index = 0;
  const nextTick = () => {
    const batch = items.slice(index, index + chunkSize);
    if (batch.length > 0) {
      processor(batch);
      index += chunkSize;
      setImmediate(nextTick);
    }
  };
  nextTick();
}