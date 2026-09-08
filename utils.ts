export interface Entity2D {
  id: number;
  x: number;
  y: number;
}

export class SpatialGridOptimizer {
  private cellSize: number;
  private grid: Map<number, number[]>;
  private pool: number[][];

  constructor(cellSize: number = 64) {
    this.cellSize = cellSize;
    this.grid = new Map();
    this.pool = Array.from({ length: 256 }, () => []);
  }

  private getHash(x: number, y: number): number {
    const cx = (Math.floor(x / this.cellSize) + 32768) & 0xffff;
    const cy = (Math.floor(y / this.cellSize) + 32768) & 0xffff;
    return (cx << 16) | cy;
  }

  private acquireArray(): number[] {
    return this.pool.pop() || [];
  }

  private releaseArray(arr: number[]): void {
    arr.length = 0;
    if (this.pool.length < 512) {
      this.pool.push(arr);
    }
  }

  public clear(): void {
    for (const list of this.grid.values()) {
      this.releaseArray(list);
    }
    this.grid.clear();
  }

  public insert(entity: Entity2D): void {
    const hash = this.getHash(entity.x, entity.y);
    let list = this.grid.get(hash);
    if (!list) {
      list = this.acquireArray();
      this.grid.set(hash, list);
    }
    list.push(entity.id);
  }

  public retrieve(x: number, y: number, range: number): number[] {
    const results: number[] = [];
    const startX = x - range;
    const endX = x + range;
    const startY = y - range;
    const endY = y + range;

    for (let gx = startX; gx <= endX + this.cellSize; gx += this.cellSize) {
      for (let gy = startY; gy <= endY + this.cellSize; gy += this.cellSize) {
        const hash = this.getHash(gx, gy);
        const bucket = this.grid.get(hash);
        if (bucket) {
          for (let i = 0; i < bucket.length; i++) {
            results.push(bucket[i]);
          }
        }
      }
    }
    return results;
  }
}