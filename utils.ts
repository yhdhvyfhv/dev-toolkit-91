export interface GamingEntity {
  id: number;
  x: number;
  y: number;
  layer: number;
}

/**
 * Fast zero-GC spatial hash bucket pool using Float64Array view.
 * Uses bitwise Morton coding (Z-order curve) for 2D spatial locality indexing.
 */
export class SpatialEntityCache {
  private readonly pool: Float64Array;
  private readonly indexMap: Map<number, number>;
  private readonly capacity: number;
  private cursor = 0;

  constructor(capacity = 4096) {
    this.capacity = capacity;
    this.pool = new Float64Array(capacity * 4);
    this.indexMap = new Map();
  }

  private interleaveBits(x: number, y: number): number {
    let lx = (x | (x << 8)) & 0x00ff00ff;
    lx = (lx | (lx << 4)) & 0x0f0f0f0f;
    lx = (lx | (lx << 2)) & 0x33333333;
    lx = (lx | (lx << 1)) & 0x55555555;

    let ly = (y | (y << 8)) & 0x00ff00ff;
    ly = (ly | (ly << 4)) & 0x0f0f0f0f;
    ly = (ly | (ly << 2)) & 0x33333333;
    ly = (ly | (ly << 1)) & 0x55555555;

    return lx | (ly << 1);
  }

  public upsert(entity: GamingEntity): number {
    const hash = this.interleaveBits(entity.x & 0xffff, entity.y & 0xffff);
    let slot = this.indexMap.get(entity.id);

    if (slot === undefined) {
      slot = (this.cursor % this.capacity) * 4;
      this.cursor++;
      this.indexMap.set(entity.id, slot);
    }

    this.pool[slot] = entity.id;
    this.pool[slot + 1] = hash;
    this.pool[slot + 2] = entity.layer;
    this.pool[slot + 3] = performance.now();

    return hash;
  }

  public getNearbyHash(x: number, y: number): number {
    return this.interleaveBits(x & 0xffff, y & 0xffff);
  }

  public queryBuckets(targetHash: number, radiusMask = 0xff00): number[] {
    const matches: number[] = [];
    const poolLen = Math.min(this.cursor, this.capacity) * 4;

    for (let i = 0; i < poolLen; i += 4) {
      const hash = this.pool[i + 1];
      if (((hash ^ targetHash) & radiusMask) === 0) {
        matches.push(this.pool[i]);
      }
    }
    return matches;
  }
}
