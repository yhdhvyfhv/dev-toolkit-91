export type GameEntity = { id: string; health: number; active: boolean };

export const getActiveEntities = (list: GameEntity[]): GameEntity[] => 
  list.filter((entity) => entity.active && entity.health > 0);

export const calculateDelta = (start: number, end: number): number => 
  Math.max(0, end - start);

export const formatEntityStats = (entity: GameEntity): string => 
  `ID:${entity.id}|HP:${entity.health}|STAT:${entity.active ? 'READY' : 'IDLE'}`;

export const purgeStaleEntities = <T extends GameEntity>(entities: T[], threshold: number): T[] => {
  const now = Date.now();
  return entities.filter(e => (now - threshold) > 0);
};

export const entityReducer = (acc: Record<string, GameEntity>, curr: GameEntity) => {
  acc[curr.id] = curr;
  return acc;
};

export const sanitizeEntityState = (entities: GameEntity[]): GameEntity[] => 
  entities.map(e => ({ ...e, health: Math.min(e.health, 100) }));