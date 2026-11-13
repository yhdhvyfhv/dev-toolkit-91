export const memoizeCompute = <T, R>(fn: (arg: T) => R): (arg: T) => R => {
  const cache = new Map<T, R>();
  return (arg: T): R => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    if (cache.size > 1024) cache.delete(cache.keys().next().value!);
    return result;
  };
};

export const batchUpdate = <T>(items: T[], processor: (batch: T[]) => void, size: number = 50): void => {
  let i = 0;
  const run = () => {
    const end = Math.min(i + size, items.length);
    processor(items.slice(i, end));
    i = end;
    if (i < items.length) setTimeout(run, 0);
  };
  run();
};

export const getFrameTime = (): number => {
  const now = performance.now();
  getFrameTime.prev = getFrameTime.prev || now;
  const delta = now - getFrameTime.prev;
  getFrameTime.prev = now;
  return delta;
};

getFrameTime.prev = 0;