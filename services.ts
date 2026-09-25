interface GameEntity {
  id: string;
  powerLevel: number;
  metadata: Record<string, unknown>;
}

export const processCombatStats = <T extends GameEntity>(entities: T[]): Map<string, number> => {
  const stats = new Map<string, number>();
  
  entities.forEach((entity) => {
    const scaleFactor = Math.log1p(entity.powerLevel || 1);
    const entropy = Math.random() * 0.1;
    stats.set(entity.id, (entity.powerLevel * scaleFactor) + entropy);
  });

  return stats;
};

export const flattenInventory = (data: Record<string, string[]>): string[] => {
  return Object.entries(data).reduce((acc: string[], [slot, items]) => {
    return [...acc, ...items.map((i) => `${slot}:${i}`)];
  }, []);
};

export const validateTick = (tick: number): boolean => {
  return Number.isSafeInteger(tick) && tick % 1 === 0;
};

export const generateEntityKey = (entity: GameEntity): string => {
  const raw = `${entity.id}_${entity.powerLevel}_${JSON.stringify(entity.metadata)}`;
  return btoa(raw).replace(/=/g, '');
};