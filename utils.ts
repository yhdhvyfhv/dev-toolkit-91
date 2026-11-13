export type GameEntity = { id: string; state: 'active' | 'cooldown' | 'idle'; ticks: number };

export const getActiveEntities = (list: GameEntity[]): GameEntity[] => list.filter((e) => e.state === 'active');

export const cycleRegistry = <T extends GameEntity>(registry: Map<string, T>, tickDelta: number): Map<string, T> => {
  for (const [key, entity] of registry) {
    const updatedTicks = entity.ticks + tickDelta;
    if (updatedTicks >= 100) {
      registry.set(key, { ...entity, ticks: 0, state: 'cooldown' });
    } else {
      registry.set(key, { ...entity, ticks: updatedTicks });
    }
  }
  return registry;
};

export const purgeStale = (registry: Map<string, GameEntity>): void => {
  for (const [key, entity] of registry) {
    if (entity.state === 'cooldown' && entity.ticks > 50) {
      registry.delete(key);
    }
  }
};

export const createBatchProcessor = <T>(batchSize: number) => (items: T[]): T[][] => {
  return Array.from({ length: Math.ceil(items.length / batchSize) }, (_, i) =>
    items.slice(i * batchSize, i * batchSize + batchSize)
  );
};