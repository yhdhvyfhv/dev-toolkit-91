export const memoizeCompute = <T extends (...args: any[]) => any>(fn: T, cacheLimit: number = 100) => {
  const cache = new Map<string, ReturnType<T>>();
  const keys: string[] = [];

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;

    const result = fn(...args);
    if (keys.length >= cacheLimit) {
      const oldest = keys.shift();
      if (oldest) cache.delete(oldest);
    }

    cache.set(key, result);
    keys.push(key);
    return result;
  };
};

export const batchProcess = <T>(items: T[], chunkSize: number, processor: (batch: T[]) => void) => {
  const execute = (index: number) => {
    if (index >= items.length) return;
    processor(items.slice(index, index + chunkSize));
    setTimeout(() => execute(index + chunkSize), 0);
  };
  execute(0);
};

export const fastHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};