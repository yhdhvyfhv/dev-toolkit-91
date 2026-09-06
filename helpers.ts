export type GameEntity = { id: string; state: 'active' | 'cooldown' | 'archived'; tick: number };

export const sanitizeEntity = (entity: Partial<GameEntity>): GameEntity => ({
  id: entity.id ?? Math.random().toString(36).slice(2),
  state: entity.state ?? 'active',
  tick: entity.tick ?? 0
});

export const batchUpdate = <T>(items: T[], mutator: (item: T) => T): T[] => 
  items.map(mutator);

export const entityFilter = {
  active: (list: GameEntity[]) => list.filter(e => e.state === 'active'),
  expired: (list: GameEntity[]) => list.filter(e => e.tick > 1000)
};

export const processRegistry = (registry: Map<string, GameEntity>) => {
  const results: GameEntity[] = [];
  for (const [key, entity] of registry.entries()) {
    if (entity.state === 'archived') {
      registry.delete(key);
      continue;
    }
    results.push({ ...entity, tick: entity.tick + 1 });
  }
  return results;
};

export const createLogger = (prefix: string) => ({
  log: (msg: string) => console.log(`[${prefix.toUpperCase()}]: ${msg}`),
  warn: (msg: string) => console.warn(`[${prefix.toUpperCase()}]: WARNING - ${msg}`)
});