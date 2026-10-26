export type LootTable<T> = Array<{ item: T; weight: number }>;

export const rollWeighted = <T>(table: LootTable<T>): T => {
  const total = table.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = Math.random() * total;
  for (const entry of table) {
    threshold -= entry.weight;
    if (threshold <= 0) return entry.item;
  }
  return table[table.length - 1].item;
};

export const formatTicks = (ticks: number): string => {
  const seconds = Math.floor(ticks / 60);
  const remainder = ticks % 60;
  return `${seconds.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
};

export const throttleAction = <T extends (...args: any[]) => void>(fn: T, cooldown: number) => {
  let lastExec = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastExec >= cooldown) {
      lastExec = now;
      fn(...args);
    }
  };
};

export const normalizeVector = (x: number, y: number): [number, number] => {
  const len = Math.sqrt(x * x + y * y);
  return len === 0 ? [0, 0] : [x / len, y / len];
};