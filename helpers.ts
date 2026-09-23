export const memoizeGameTicker = <T extends (...args: any[]) => any>(fn: T, ttl: number = 16): T => {
  let lastCall = 0;
  let lastResult: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastCall > ttl) {
      lastResult = fn(...args);
      lastCall = now;
    }
    return lastResult;
  }) as T;
};

export const batchProcess = <T>(items: T[], chunkSize: number = 50): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

export const fastObjectCloner = <T>(obj: T): T => {
  if (typeof structuredClone === 'function') return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
};

export const throttledRaf = (callback: FrameRequestCallback) => {
  let ticking = false;
  return (time: number) => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame((t) => {
        callback(t);
        ticking = false;
      });
    }
  };
};