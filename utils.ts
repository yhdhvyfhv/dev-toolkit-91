export const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);

export const lerp = (start: number, end: number, alpha: number): number => start * (1 - alpha) + end * alpha;

export const spawnChance = (probability: number): boolean => Math.random() < probability;

export const uuid = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

export const throttle = <T extends (...args: any[]) => void>(func: T, limit: number) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const range = (start: number, end: number): number[] => 
  Array.from({ length: end - start + 1 }, (_, i) => start + i);