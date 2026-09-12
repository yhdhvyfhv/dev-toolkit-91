export class SpatialGrid {
  private grid: Int32Array;
  private counts: Int32Array;
  private cellSize: number;
  private cols: number;
  private maxPerCell: number;

  constructor(width: number, height: number, cellSize: number, maxPerCell: number) {
    this.cellSize = cellSize;
    this.maxPerCell = maxPerCell;
    this.cols = (width / cellSize) | 0;
    const rows = (height / cellSize) | 0;
    this.grid = new Int32Array(this.cols * rows * maxPerCell).fill(-1);
    this.counts = new Int32Array(this.cols * rows);
  }

  public reset(): void {
    this.grid.fill(-1);
    this.counts.fill(0);
  }

  public add(id: number, x: number, y: number): void {
    const col = (x / this.cellSize) | 0;
    const row = (y / this.cellSize) | 0;
    const idx = col + row * this.cols;
    if (idx < 0 || idx >= this.counts.length) return;
    const count = this.counts[idx];
    if (count < this.maxPerCell) {
      this.grid[idx * this.maxPerCell + count] = id;
      this.counts[idx] = count + 1;
    }
  }

  public query(x: number, y: number, out: Int32Array): number {
    const cx = (x / this.cellSize) | 0;
    const cy = (y / this.cellSize) | 0;
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const idx = (cx + dx) + (cy + dy) * this.cols;
        if (idx >= 0 && idx < this.counts.length) {
          const size = this.counts[idx];
          const start = idx * this.maxPerCell;
          for (let i = 0; i < size && count < out.length; i++) {
            out[count++] = this.grid[start + i];
          }
        }
      }
    }
    return count;
  }
}