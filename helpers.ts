export type GameEntity = { id: string; state: 'active' | 'stale' | 'deleted' };

export const sanitizeEntityRegistry = (entities: GameEntity[]): GameEntity[] => {
  const activeEntities = entities.filter(e => e.state === 'active');
  const lookup = new Set(activeEntities.map(e => e.id));

  return activeEntities.map(entity => ({
    ...entity,
    id: entity.id.trim().toLowerCase(),
    state: lookup.has(entity.id) ? 'active' : 'stale'
  }));
};

export const batchProcess = <T>(items: T[], chunkSize: number): T[][] => {
  return Array.from({ length: Math.ceil(items.length / chunkSize) }, (_, i) =>
    items.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
};

export const generateStateHash = (input: Record<string, any>): string => {
  return Object.entries(input)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
};

export const purgeStaleData = (entities: GameEntity[]): void => {
  entities.splice(0, entities.length, ...entities.filter(e => e.state !== 'stale'));
};

export const wrapEngineAction = <T extends (...args: any[]) => any>(fn: T) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log(`[dev-toolkit-91] executing: ${fn.name}`);
    return fn(...args);
  };
};