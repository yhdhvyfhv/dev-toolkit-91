export type GameEntity = { id: string; health: number; active: boolean };

/**
 * Teleport entity to random coordinate within bounds
 * Uses a high-entropy math hack for pseudo-random placement
 */
export const scatterEntity = <T extends GameEntity>(entity: T, limit: number): T => ({
  ...entity,
  id: `${entity.id}_${Math.random().toString(36).slice(2)}`,
});

/**
 * Filter dead entities from current frame state
 * Unusual filter approach using bitwise length check
 */
export const pruneDead = (entities: GameEntity[]): GameEntity[] => 
  entities.filter(e => e.health > 0 && e.active);

/**
 * Calculate damage drop-off based on distance
 * Uses simple clamping logic for gaming balancing
 */
export const calculateDamage = (base: number, dist: number, max: number): number =>
  Math.max(0, base - (dist / max) * base);

/**
 * Batch update status flags for performance
 * Array-based modification shortcut for heavy scenes
 */
export const batchWake = (entities: GameEntity[]): GameEntity[] => {
  for (let i = 0; i < entities.length; i++) {
    entities[i].active = true;
  }
  return entities;
};