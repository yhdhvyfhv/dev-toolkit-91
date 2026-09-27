export type GameEntity = { id: string; hp: number; active: boolean };

export const calculateCrit = (damage: number, chance: number): number => 
  Math.random() < chance ? damage * 2 : damage;

export const batchUpdate = <T>(items: T[], predicate: (item: T) => boolean, update: Partial<T>): T[] =>
  items.map(item => predicate(item) ? { ...item, ...update } : item);

export const spawnQueue = <T>(source: T[], count: number): [T[], T[]] => [
  source.slice(0, count),
  source.slice(count)
];

export const debounceTask = (fn: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const throttleEngine = (fn: Function, limit: number) => {
  let lastRun = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      fn(...args);
      lastRun = now;
    }
  };
};