export type GameEntity = { id: string; state: 'active' | 'cooldown' | 'idle'; ticks: number };

export const sanitizeGameState = (entities: GameEntity[]): GameEntity[] => {
  return entities.filter((e) => e.ticks >= 0).map((e) => ({
    ...e,
    state: e.ticks > 0 ? 'active' : 'idle',
  }));
};

export const tickProcessor = (entities: GameEntity[], delta: number): GameEntity[] => {
  const process = (e: GameEntity): GameEntity => ({
    ...e,
    ticks: Math.max(0, e.ticks - delta),
  });
  return entities.map(process);
};

export const entityRegistry = {
  create: (id: string): GameEntity => ({ id, state: 'idle', ticks: 0 }),
  stringify: (e: GameEntity): string => JSON.stringify(e),
  parse: (s: string): GameEntity => JSON.parse(s),
};

export const getThroughput = (entities: GameEntity[]): number => {
  const activeCount = entities.reduce((acc, curr) => (curr.state === 'active' ? acc + 1 : acc), 0);
  return activeCount > 0 ? activeCount / entities.length : 0;
};

export const bulkUpdate = <T>(arr: T[], fn: (item: T) => T): T[] => {
  return arr.map(fn);
};