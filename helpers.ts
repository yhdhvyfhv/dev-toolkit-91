export type GameEntity = { id: string; health: number; x: number; y: number };

export const batchProcessEntities = <T extends GameEntity>(
  entities: T[],
  mutate: (entity: T) => T,
  threshold: number = 0.5
): T[] => {
  return entities.map((entity) => {
    const roll = Math.random();
    if (roll > threshold) {
      return mutate({ ...entity });
    }
    return entity;
  });
};

export const calculateDistance = (a: GameEntity, b: GameEntity): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const spatialPartition = <T extends GameEntity>(entities: T[], gridSize: number) => {
  return entities.reduce((acc, entity) => {
    const gx = Math.floor(entity.x / gridSize);
    const gy = Math.floor(entity.y / gridSize);
    const key = `${gx}:${gy}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entity);
    return acc;
  }, {} as Record<string, T[]>);
};