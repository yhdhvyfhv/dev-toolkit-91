export class SpatialEntityArena {
  private readonly data: Float32Array;
  private readonly stride = 5;
  private count = 0;

  constructor(private readonly maxEntities: number = 10000) {
    this.data = new Float32Array(maxEntities * this.stride);
  }

  public spawn(x: number, y: number, vx: number, vy: number): number {
    if (this.count >= this.maxEntities) return -1;
    const ptr = this.count * this.stride;
    this.data[ptr] = x;
    this.data[ptr + 1] = y;
    this.data[ptr + 2] = vx;
    this.data[ptr + 3] = vy;
    this.data[ptr + 4] = 1.0;
    return this.count++;
  }

  public updateBatch(delta: number): void {
    const total = this.count * this.stride;
    for (let i = 0; i < total; i += this.stride) {
      if (this.data[i + 4] === 1.0) {
        this.data[i] += this.data[i + 2] * delta;
        this.data[i + 1] += this.data[i + 3] * delta;
      }
    }
  }

  public queryRegion(minX: number, minY: number, maxX: number, maxY: number): Uint32Array {
    const matches = new Uint32Array(this.count);
    let matchCount = 0;
    const total = this.count * this.stride;

    for (let i = 0, id = 0; i < total; i += this.stride, id++) {
      if (this.data[i + 4] === 1.0) {
        const x = this.data[i];
        const y = this.data[i + 1];
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          matches[matchCount++] = id;
        }
      }
    }
    return matches.subarray(0, matchCount);
  }

  public clear(): void {
    this.data.fill(0);
    this.count = 0;
  }
}