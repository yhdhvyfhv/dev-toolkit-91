interface GameEntity { id: string; health: number; active: boolean; }

const stateManager = {
  pool: new Map<string, GameEntity>(),
  sanitize: (entities: GameEntity[]) => entities.filter(e => e.active && e.health > 0),
  sync: (registry: GameEntity[]) => {
    stateManager.pool.clear();
    registry.forEach(e => stateManager.pool.set(e.id, e));
  }
};

export const cleanup = (entities: GameEntity[]): GameEntity[] => {
  const clean = stateManager.sanitize(entities);
  stateManager.sync(clean);
  return clean;
};

export const fetchActiveUnits = (ids: string[]): GameEntity[] => {
  return ids.map(id => stateManager.pool.get(id)).filter((e): e is GameEntity => !!e);
};

export const resetEntityRegistry = (): void => {
  stateManager.pool.clear();
};

export type ServiceResponse<T> = { data: T; timestamp: number; };

export const wrapResponse = <T>(data: T): ServiceResponse<T> => ({
  data,
  timestamp: Date.now()
});