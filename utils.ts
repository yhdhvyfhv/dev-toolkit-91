export interface Entity2D {
  id: number;
  x: number;
  y: number;
  radius: number;
}

/**
 * Flat Uint32Array spatial hash grid designed to eliminate GC pressure
 * during 60 FPS entity proximity lookups in the game core loop.
 */
export class SpatialGridOptimizer {
  private readonly cellSize: number;
  private readonly widthBuckets: number;
  private readonly heightBuckets: number;
  private readonly grid: Uint32Array;
  private readonly maxPerCell: number;

  constructor(worldWidth: number, worldHeight: number, cellSize: number, maxPerCell = 16) {
    this.cellSize = cellSize;
    this.widthBuckets = Math.ceil(worldWidth / cellSize);
    this.heightBuckets = Math.ceil(worldHeight / cellSize);
    this.maxPerCell = maxPerCell;
    this.grid = new Uint32Array(this.widthBuckets * this.heightBuckets * (maxPerCell + 1));
  }

  public clear(): void {
    this.grid.fill(0);
  }

  public insert(entity: Entity2D): void {
    const cellX = (entity.x / this.cellSize) | 0;
    const cellY = (entity.y / this.cellSize) | 0;
    if (cellX < 0 || cellX >= this.widthBuckets || cellY < 0 || cellY >= this.heightBuckets) return;

    const baseIndex = (cellY * this.widthBuckets + cellX) * (this.maxPerCell + 1);
    const count = this.grid[baseIndex];

    if (count < this.maxPerCell) {
      this.grid[baseIndex + 1 + count] = entity.id;
      this.grid[baseIndex] = count + 1;
    }
  }

  public queryNearby(x: number, y: number, buffer: Uint32Array): number {
    const cx = (x / this.cellSize) | 0;
    const cy = (y / this.cellSize) | 0;
    let wrote = 0;

    for (let dy = -1; dy <= 1; dy++) {
      const targetY = cy + dy;
      if (targetY < 0 || targetY >= this.heightBuckets) continue;

      for (let dx = -1; dx <= 1; dx++) {
        const targetX = cx + dx;
        if (targetX < 0 || targetX >= this.widthBuckets) continue;

        const baseIndex = (targetY * this.widthBuckets + targetX) * (this.maxPerCell + 1);
        const count = this.grid[baseIndex];

        for (let i = 0; i < count && wrote < buffer.length; i++) {
          buffer[wrote++] = this.grid[baseIndex + 1 + i];
        }
      }
    }

    return wrote;
  }
}