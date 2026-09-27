export interface SpatialEntity {
  id: number;
  x: number;
  y: number;
}

/**
 * Zero-allocation bitwise spatial hash grid for ultra-fast frame proximity queries.
 * Replaces traditional dynamic array allocations with a flat Uint32Array ring buffer.
 */
export class FastSpatialGrid {
  private readonly cellBits: number;
  private readonly gridWidth: number;
  private readonly buckets: Uint32Array;
  private readonly maxEntitiesPerCell: number = 4;

  constructor(worldSize: number, cellSize: number) {
    this.cellBits = 31 - Math.clz32(cellSize);
    this.gridWidth = Math.ceil(worldSize / cellSize);
    const totalCells = this.gridWidth * this.gridWidth;
    this.buckets = new Uint32Array(totalCells * (1 + this.maxEntitiesPerCell));
  }

  public clear(): void {
    this.buckets.fill(0);
  }

  public insert(entity: SpatialEntity): boolean {
    const cx = Math.max(0, entity.x >> this.cellBits);
    const cy = Math.max(0, entity.y >> this.cellBits);
    const cellIdx = cy * this.gridWidth + cx;
    const baseOffset = cellIdx * (1 + this.maxEntitiesPerCell);

    const count = this.buckets[baseOffset];
    if (count >= this.maxEntitiesPerCell) return false;

    this.buckets[baseOffset + 1 + count] = entity.id;
    this.buckets[baseOffset] = count + 1;
    return true;
  }

  public queryAreaIntoBuffer(x: number, y: number, targetBuffer: Int32Array): number {
    const cx = x >> this.cellBits;
    const cy = y >> this.cellBits;
    let foundCount = 0;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= this.gridWidth || ny >= this.gridWidth) continue;

        const cellIdx = ny * this.gridWidth + nx;
        const baseOffset = cellIdx * (1 + this.maxEntitiesPerCell);
        const count = this.buckets[baseOffset];

        for (let i = 0; i < count; i++) {
          if (foundCount < targetBuffer.length) {
            targetBuffer[foundCount++] = this.buckets[baseOffset + 1 + i];
          }
        }
      }
    }
    return foundCount;
  }
}