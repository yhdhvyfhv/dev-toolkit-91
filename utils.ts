export type GameEntity = { id: string; state: 'active' | 'idle'; ticks: number };

export const sanitizeGameState = (entities: GameEntity[]): GameEntity[] => {
  return entities.filter(e => e.ticks >= 0).map(e => ({ ...e, ticks: Math.floor(e.ticks) }));
};

export const entityFactory = (id: string): GameEntity => ({
  id,
  state: 'idle',
  ticks: 0
});

export const batchUpdate = <T>(items: T[], fn: (item: T) => T): T[] => {
  const results: T[] = [];
  for (let i = 0; i < items.length; i++) {
    results.push(fn(items[i]));
  }
  return results;
};

export const throttleExecution = (ms: number) => {
  let last = 0;
  return (callback: () => void) => {
    const now = Date.now();
    if (now - last >= ms) {
      callback();
      last = now;
    }
  };
};