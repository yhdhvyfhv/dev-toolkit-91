export type GameEntity = { id: string; health: number; xp: number };

export const mutateGameState = <T extends GameEntity>(
  entities: T[],
  modifier: (e: T) => Partial<T>
): T[] => {
  return entities.map((entity) => {
    const changes = modifier(entity);
    return { ...entity, ...changes };
  });
};

export const calculateLootDrop = (rarity: 'common' | 'rare' | 'legendary'): string => {
  const pool = {
    common: ['iron_sword', 'health_potion'],
    rare: ['steel_plate', 'mana_ring'],
    legendary: ['dragon_slayer', 'archmage_robe']
  };
  const items = pool[rarity];
  return items[Math.floor(Math.random() * items.length)];
};

export const normalizeStats = (value: number, max: number): number => {
  return Math.min(Math.max(value, 0), max) / max;
};

export const batchProcess = <T>(items: T[], limit: number): T[][] => {
  return Array.from({ length: Math.ceil(items.length / limit) }, (_, i) =>
    items.slice(i * limit, i * limit + limit)
  );
};