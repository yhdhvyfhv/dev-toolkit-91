export const memoizeCompute = <T, R>(fn: (arg: T) => R, ttl: number = 5000) => {
  const cache = new Map<T, { val: R; expiry: number }>();
  return (arg: T): R => {
    const now = Date.now();
    const cached = cache.get(arg);
    if (cached && cached.expiry > now) return cached.val;
    const result = fn(arg);
    cache.set(arg, { val: result, expiry: now + ttl });
    if (cache.size > 100) cache.delete(cache.keys().next().value);
    return result;
  };
};

export const batchUpdate = <T>(items: T[], process: (batch: T[]) => void, size: number = 50) => {
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    setTimeout(() => process(slice), 0);
  }
};

export const fastHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

export type PerfContext = {
  start: number;
  label: string;
};

export const trackPerformance = (label: string): PerfContext => ({ start: performance.now(), label });

export const endPerformance = (ctx: PerfContext): void => {
  const duration = performance.now() - ctx.start;
  if (duration > 16.6) console.warn(`[dev-toolkit-91] Frame drop detected in ${ctx.label}: ${duration.toFixed(2)}ms`);
};