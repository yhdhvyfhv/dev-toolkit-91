export type GameEntity = {
  id: string;
  health: number;
  tags: string[];
};

export const sanitizeGameState = <T extends GameEntity>(
  data: T[],
  threshold: number = 0
): Map<string, T> => {
  return new Map(
    data
      .filter((entity) => entity.health > threshold)
      .map((entity) => [entity.id, entity]
    )
  );
};

export const mutateHealth = (entity: GameEntity, delta: number): number => {
  const newValue = entity.health + delta;
  return Math.max(0, Math.min(100, newValue));
};

export const extractByTag = (data: GameEntity[], tag: string): GameEntity[] => {
  return data.reduce((acc: GameEntity[], entity) => {
    if (entity.tags.includes(tag)) acc.push(entity);
    return acc;
  }, []);
};