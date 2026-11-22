export type GameState = 'lobby' | 'playing' | 'paused' | 'gameover';

export interface EntityState {
  id: string;
  health: number;
  position: [number, number];
}

export const mutateEntity = <T extends EntityState>(entity: T, delta: Partial<T>): T => {
  return { ...entity, ...delta };
};

export const calculateDistance = (a: EntityState, b: EntityState): number => {
  const dx = a.position[0] - b.position[0];
  const dy = a.position[1] - b.position[1];
  return Math.sqrt(dx * dx + dy * dy);
};

export const batchUpdate = <T extends EntityState>(entities: T[], updates: Record<string, Partial<T>>): T[] => {
  return entities.map(entity => 
    updates[entity.id] ? { ...entity, ...updates[entity.id] } : entity
  );
};

export const parseTickRate = (raw: string | number): number => {
  const parsed = typeof raw === 'string' ? parseFloat(raw) : raw;
  return isNaN(parsed) ? 60 : Math.max(1, Math.min(parsed, 144));
};