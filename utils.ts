export type LootTable<T> = Map<number, T>;

export const rollLoot = <T>(table: LootTable<T>): T | null => {
  const weights = Array.from(table.keys());
  const total = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * total;

  for (const [weight, item] of table.entries()) {
    random -= weight;
    if (random <= 0) return item;
  }
  return null;
};

export const serializeGameStats = <T extends Record<string, any>>(stats: T): string => {
  const buffer = Object.entries(stats).map(([k, v]) => `${k}:${v}`).join('|');
  return btoa(buffer);
};

export const deserializeGameStats = (encoded: string): Record<string, string> => {
  const decoded = atob(encoded);
  return Object.fromEntries(decoded.split('|').map(pair => pair.split(':')));
};

export const createLevelMultiplier = (base: number) => (level: number): number => {
  return Math.floor(base * Math.pow(1.15, level - 1));
};