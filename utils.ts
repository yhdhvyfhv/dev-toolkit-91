export interface EntityState {
  id: number;
  x: number;
  y: number;
  hp: number;
  flags: number;
}

export type CompressedFrame = bigint[];

/**
 * Creative bit-packing utility for frame rollback buffers and compact state transmission.
 * Packs 16-bit IDs, 12-bit spatial coordinates, and 8-bit status flags into single bigint slots.
 */
export class GameStateCompressor {
  private static readonly MASK_12 = 0xFFFn;
  private static readonly MASK_8 = 0xFFn;
  private static readonly MASK_16 = 0xFFFFn;

  static pack(entities: EntityState[]): CompressedFrame {
    return entities.map(e => {
      const idBits = BigInt(e.id & 0xFFFF) << 48n;
      const xBits = BigInt(Math.floor(Math.max(0, Math.min(4095, e.x)))) << 36n;
      const yBits = BigInt(Math.floor(Math.max(0, Math.min(4095, e.y)))) << 24n;
      const hpBits = BigInt(e.hp & 0xFF) << 16n;
      const flagBits = BigInt(e.flags & 0xFFFF);
      return idBits | xBits | yBits | hpBits | flagBits;
    });
  }

  static unpack(packed: CompressedFrame): EntityState[] {
    return packed.map(raw => ({
      id: Number((raw >> 48n) & this.MASK_16),
      x: Number((raw >> 36n) & this.MASK_12),
      y: Number((raw >> 24n) & this.MASK_12),
      hp: Number((raw >> 16n) & this.MASK_8),
      flags: Number(raw & this.MASK_16),
    }));
  }

  static diff(previous: CompressedFrame, current: CompressedFrame): Map<number, bigint> {
    const changes = new Map<number, bigint>();
    const len = Math.max(previous.length, current.length);
    for (let i = 0; i < len; i++) {
      if (previous[i] !== current[i]) {
        changes.set(i, current[i] ?? 0n);
      }
    }
    return changes;
  }
}