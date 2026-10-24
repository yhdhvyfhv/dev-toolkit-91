export interface Vector2D {
  x: number;
  y: number;
}

export function interleaveBits(x: number, y: number): number {
  let z = 0;
  const clampedX = Math.max(0, Math.min(x, 0xffff)) | 0;
  const clampedY = Math.max(0, Math.min(y, 0xffff)) | 0;
  for (let i = 0; i < 16; i++) {
    z |= ((clampedX & (1 << i)) << i) | ((clampedY & (1 << i)) << (i + 1));
  }
  return z >>> 0;
}

export class EntityState {
  private flags: number;

  constructor(initialFlags: number = 0) {
    this.flags = initialFlags;
  }

  toggle(bitMask: number, enabled?: boolean): this {
    const shouldEnable = enabled ?? ((this.flags & bitMask) === 0);
    this.flags = shouldEnable ? (this.flags | bitMask) : (this.flags & ~bitMask);
    return this;
  }

  has(bitMask: number): boolean {
    return (this.flags & bitMask) === bitMask;
  }

  get raw(): number {
    return this.flags;
  }
}

export class FrameSmoother {
  private samples: Float32Array;
  private pointer: number = 0;

  constructor(sampleCount = 10, defaultDelta = 0.016) {
    this.samples = new Float32Array(sampleCount).fill(defaultDelta);
  }

  push(dt: number): number {
    this.samples[this.pointer] = dt;
    this.pointer = (this.pointer + 1) % this.samples.length;
    let sum = 0;
    for (let i = 0; i < this.samples.length; i++) {
      sum += this.samples[i];
    }
    return sum / this.samples.length;
  }
}

export function createFastRng(seed: number): () => number {
  let s = (seed || 1) >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}