export type LootTable<T> = Record<string, { item: T; weight: number }>;

export const rollLoot = <T>(table: LootTable<T>): T | null => {
  const entries = Object.values(table);
  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const entry of entries) {
    random -= entry.weight;
    if (random <= 0) return entry.item;
  }
  return entries[entries.length - 1]?.item || null;
};

export const packGameState = (state: Record<string, any>): string => {
  const buffer = Object.entries(state).map(([k, v]) => `${k}:${v}`).join('|');
  return btoa(buffer);
};

export const unpackGameState = (packed: string): Record<string, any> => {
  const decoded = atob(packed);
  return decoded.split('|').reduce((acc, pair) => {
    const [key, val] = pair.split(':');
    acc[key] = isNaN(Number(val)) ? val : Number(val);
    return acc;
  }, {} as Record<string, any>);
};

export const throttleAction = <T extends (...args: any[]) => void>(fn: T, ms: number) => {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last > ms) {
      last = now;
      fn(...args);
    }
  };
};