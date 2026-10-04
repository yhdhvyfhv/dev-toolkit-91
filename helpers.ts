export const memoizeState = <T extends (...args: any[]) => any>(fn: T, ttl: number = 1000): T => {
  let cache = new Map<string, { value: ReturnType<T>; expiry: number }>();
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const entry = cache.get(key);
    if (entry && entry.expiry > now) return entry.value;
    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ttl });
    return result;
  }) as T;
};

export const batchUpdate = <T>(items: T[], chunkSize: number = 64): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

export const frameThrottle = (callback: Function, limit: number = 16) => {
  let lastFrame = 0;
  return (...args: any[]) => {
    const now = performance.now();
    if (now - lastFrame >= limit) {
      lastFrame = now;
      requestAnimationFrame(() => callback(...args));
    }
  };
};