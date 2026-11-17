export const memoizeCompute = <T extends any[], R>(fn: (...args: T) => R, ttl: number = 5000): (...args: T) => R => {
  const cache = new Map<string, { value: R; expiry: number }>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && cached.expiry > now) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ttl });
    return result;
  };
};

export const batchUpdate = <T>(items: T[], processor: (batch: T[]) => void, chunkSize: number = 50): void => {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    requestIdleCallback(() => processor(chunk));
  }
};

export const frameBudgetThrottler = (fn: Function, budget: number = 16) => {
  let last = performance.now();
  return (...args: any[]) => {
    const now = performance.now();
    if (now - last > budget) {
      fn(...args);
      last = now;
    }
  };
};