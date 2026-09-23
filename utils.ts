export class StatusEffectRegistry {
  private mask: bigint = 0n;

  toggle(flag: number): this {
    this.mask ^= 1n << BigInt(flag);
    return this;
  }

  has(flag: number): boolean {
    return (this.mask & (1n << BigInt(flag))) !== 0n;
  }

  hasAll(...flags: number[]): boolean {
    const query = flags.reduce((acc, f) => acc | (1n << BigInt(f)), 0n);
    return (this.mask & query) === query;
  }

  combineWith(other: StatusEffectRegistry): StatusEffectRegistry {
    const merged = new StatusEffectRegistry();
    merged.mask = this.mask | other.mask;
    return merged;
  }

  exportHex(): string {
    return '0x' + this.mask.toString(16);
  }

  static importHex(hex: string): StatusEffectRegistry {
    const reg = new StatusEffectRegistry();
    reg.mask = BigInt(hex);
    return reg;
  }
}

export function spatialGridHash(x: number, y: number, cellSize = 64): string {
  const cx = Math.floor(x / cellSize) | 0;
  const cy = Math.floor(y / cellSize) | 0;
  const pair = ((cx + cy) * (cx + cy + 1)) / 2 + cy;
  return `cell_${(pair ^ 0x5f3759df) >>> 0}`;
}

export function weightedLootRoll<T>(
  table: Array<{ item: T; weight: number }>,
  entropySource: () => number = Math.random
): T | null {
  const totalWeight = table.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
  if (totalWeight <= 0) return null;

  let roll = entropySource() * totalWeight;
  for (const entry of table) {
    if (roll <= entry.weight) return entry.item;
    roll -= entry.weight;
  }
  return table[0]?.item ?? null;
}