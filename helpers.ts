export type GameEntity = { id: string; health: number; active: boolean };

export const clamp = (val: number, min: number, max: number): number => 
  Math.min(Math.max(val, min), max);

export const generateEntityId = (prefix: string): string => 
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const batchUpdate = <T>(items: T[], predicate: (i: T) => boolean, update: Partial<T>): T[] =>
  items.map(item => predicate(item) ? { ...item, ...update } : item);

export const rollD20 = (): number => Math.floor(Math.random() * 20) + 1;

export const processTicks = <T>(queue: T[], effect: (item: T) => void): void => {
  const snapshot = [...queue];
  snapshot.forEach(effect);
};

export const lerp = (start: number, end: number, alpha: number): number =>
  start * (1 - alpha) + end * alpha;

export const isCriticalHit = (threshold: number): boolean => 
  rollD20() >= threshold;

export const throttleExecution = (fn: Function, ms: number) => {
  let last = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - last > ms) {
      last = now;
      fn(...args);
    }
  };
};