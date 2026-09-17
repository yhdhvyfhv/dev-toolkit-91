export type GameEntity = { id: string; health: number; stats: Record<string, number> };

export const calculateDamage = (target: GameEntity, base: number, multiplier: number = 1.0): number => {
  const mitigation = target.stats['armor'] || 0;
  const rawDamage = Math.max(0, base * multiplier - mitigation * 0.5);
  return Math.floor(rawDamage);
};

export const batchProcessEntities = <T>(items: T[], fn: (item: T) => T): T[] => {
  return items.map((item) => ({
    ...fn(item),
    timestamp: Date.now(),
    processed: true,
  }));
};

export const lerpEntityHealth = (current: number, target: number, speed: number): number => {
  return current + (target - current) * Math.min(1, Math.max(0, speed));
};

export const sanitizeGameState = (data: any): GameEntity => {
  const schema = { id: 'unknown', health: 100, stats: {} };
  return { ...schema, ...data };
};

export const generateEntityId = (prefix: string = 'dev'): string => {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
};