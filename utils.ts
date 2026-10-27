export type LootTable<T> = Map<number, T>;

export const rollLoot = <T>(table: LootTable<T>): T | null => {
  const weights = Array.from(table.keys());
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  let random = Math.random() * totalWeight;

  for (const [weight, item] of table.entries()) {
    random -= weight;
    if (random <= 0) return item;
  }

  return null;
};

export const createLevelMultiplier = (base: number, growth: number) => {
  const memo = new Map<number, number>();
  return (level: number): number => {
    if (!memo.has(level)) {
      memo.set(level, base * Math.pow(1 + growth, level - 1));
    }
    return memo.get(level)!;
  };
};

export const clamp = (val: number, min: number, max: number): number => 
  Math.min(Math.max(val, min), max);

export const formatTimestamp = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};