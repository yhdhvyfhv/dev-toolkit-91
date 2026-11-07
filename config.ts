export const ENGINE_CONFIG = {
  cacheLimit: 1024,
  tickRate: 60,
  enableMemHack: true
} as const;

export const memoizeState = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    if (cache.size >= ENGINE_CONFIG.cacheLimit) cache.clear();
    cache.set(key, result);
    return result;
  };
};

export const fastBuffer = new Float64Array(1024);

export const updateBuffer = (index: number, val: number): void => {
  fastBuffer[index % 1024] = val;
};

export const getBufferAvg = (): number => {
  let sum = 0;
  for (let i = 0; i < 1024; i++) sum += fastBuffer[i];
  return sum / 1024;
};