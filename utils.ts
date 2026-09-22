/**
 * Bitwise 2D Spatial Cell Key Encoder and Proximity Sampler.
 * Designed for high-density retro projectile grid calculations without heap allocations.
 */

export type WorldBounds = Readonly<{
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}>;

export type SpatialEntity<T = unknown> = {
  id: string;
  x: number;
  y: number;
  radius: number;
  payload: T;
};

/**
 * Encodes floating point 2D coordinates into a single 32-bit packed spatial hash key.
 * Uses 16-bit precision per axis with coordinate clamping via bitwise mask.
 */
export function encodeSpatialKey(x: number, y: number, cellSize: number): number {
  const cx = (Math.floor(x / cellSize) + 0x8000) & 0xffff;
  const cy = (Math.floor(y / cellSize) + 0x8000) & 0xffff;
  return (cx << 16) | cy;
}

/**
 * Executes a spatial grid proximity search, passing matches to a visitor callback.
 * Visitor returning `true` terminates search early to minimize frame processing time.
 */
export function querySpatialGrid<T>(
  grid: ReadonlyMap<number, SpatialEntity<T>[]>,
  originX: number,
  originY: number,
  searchRadius: number,
  cellSize: number,
  visitor: (entity: SpatialEntity<T>, distanceSq: number) => boolean | void
): number {
  let hitCount = 0;
  const rSq = searchRadius * searchRadius;
  const minCellX = Math.floor((originX - searchRadius) / cellSize);
  const maxCellX = Math.floor((originX + searchRadius) / cellSize);
  const minCellY = Math.floor((originY - searchRadius) / cellSize);
  const maxCellY = Math.floor((originY + searchRadius) / cellSize);

  for (let cx = minCellX; cx <= maxCellX; cx++) {
    for (let cy = minCellY; cy <= maxCellY; cy++) {
      const key = (((cx + 0x8000) & 0xffff) << 16) | ((cy + 0x8000) & 0xffff);
      const bucket = grid.get(key);
      if (!bucket) continue;

      for (let i = 0; i < bucket.length; i++) {
        const entity = bucket[i];
        const dx = entity.x - originX;
        const dy = entity.y - originY;
        const distSq = dx * dx + dy * dy;

        if (distSq <= rSq) {
          hitCount++;
          if (visitor(entity, distSq) === true) {
            return hitCount;
          }
        }
      }
    }
  }

  return hitCount;
}