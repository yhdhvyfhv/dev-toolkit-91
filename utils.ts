export class ZeroAllocSpatialGrid {
  private readonly grid: Uint32Array;
  private readonly widthCells: number;
  private readonly cellSize: number;
  private readonly maxEntitiesPerCell: number;
  private readonly stride: number;

  constructor(width: number, height: number, cellSize: number, maxEntitiesPerCell = 15) {
    this.cellSize = cellSize;
    this.widthCells = Math.ceil(width / cellSize);
    this.maxEntitiesPerCell = maxEntitiesPerCell;
    this.stride = maxEntitiesPerCell + 1;
    
    const totalCells = this.widthCells * Math.ceil(height / cellSize);
    this.grid = new Uint32Array(totalCells * this.stride);
  }

  public clear(): void {
    this.grid.fill(0);
  }

  public insert(entityId: number, x: number, y: number): boolean {
    const cx = (x / this.cellSize) | 0;
    const cy = (y / this.cellSize) | 0;
    const baseIndex = (cy * this.widthCells + cx) * this.stride;

    const count = this.grid[baseIndex];
    if (count >= this.maxEntitiesPerCell) return false;

    this.grid[baseIndex + 1 + count] = entityId;
    this.grid[baseIndex] = count + 1;
    return true;
  }

  public queryCellInto(x: number, y: number, outBuffer: Uint32Array): number {
    const cx = (x / this.cellSize) | 0;
    const cy = (y / this.cellSize) | 0;
    const baseIndex = (cy * this.widthCells + cx) * this.stride;

    const count = this.grid[baseIndex] || 0;
    for (let i = 0; i < count; i++) {
      outBuffer[i] = this.grid[baseIndex + 1 + i];
    }
    return count;
  }
}