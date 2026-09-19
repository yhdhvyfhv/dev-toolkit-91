export type Entity<T> = { id: string; data: T; timestamp: number };

export const generateId = (prefix: string = 'dev-91'): string => 
  `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export const normalizeVector = (x: number, y: number): [number, number] => {
  const mag = Math.sqrt(x * x + y * y) || 1;
  return [x / mag, y / mag];
};

export const memoizeGameLogic = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key)!;
  };
};

export const clamp = (val: number, min: number, max: number): number => 
  Math.min(Math.max(val, min), max);

export const lerp = (start: number, end: number, alpha: number): number => 
  start + (end - start) * clamp(alpha, 0, 1);

export const throttle = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last > ms) {
      last = now;
      return fn(...args);
    }
  };
};