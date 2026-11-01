/**
 * Expressive spatial packing and deterministic luck helpers for gaming runtimes.
 */

export type EncodedCoord = bigint;

// Creative 2D coordinate bit-packing into a single BigInt
export const packCoord = (x: number, y: number): EncodedCoord => {
  const ux = BigInt((x >> 0) + 0x7fff_ffff);
  const uy = BigInt((y >> 0) + 0x7fff_ffff);
  return (ux << 32n) | uy;
};

export const unpackCoord = (packed: EncodedCoord): [x: number, y: number] => {
  const ux = Number((packed >> 32n) & 0xffff_ffffn);
  const uy = Number(packed & 0xffff_ffffn);
  return [ux - 0x7fff_ffff, uy - 0x7fff_ffff];
};

type StatPipe<T extends Record<string, number>> = T & {
  multiply: (factor: number) => StatPipe<T>;
  clamp: (min: number, max: number) => StatPipe<T>;
};

// Dynamic damage and stat modifier composition using Proxy pipeline
export function pipeStats<T extends Record<string, number>>(stats: T): StatPipe<T> {
  return new Proxy(stats, {
    get(target, prop, receiver) {
      if (prop === 'multiply') {
        return (factor: number) =>
          pipeStats(
            Object.fromEntries(
              Object.entries(target).map(([k, v]) => [k, v * factor])
            ) as T
          );
      }
      if (prop === 'clamp') {
        return (min: number, max: number) =>
          pipeStats(
            Object.fromEntries(
              Object.entries(target).map(([k, v]) => [
                k,
                Math.min(max, Math.max(min, v)),
              ])
            ) as T
          );
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as StatPipe<T>;
}

// Fast seedable PRNG helper with state stepping
export const createDeterministicRng = (seed: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  let state = hash >>> 0;

  return {
    nextFloat: (): number => {
      state = (state + 0x9e3779b9) | 0;
      let z = state;
      z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
      z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
      return ((z ^ (z >>> 16)) >>> 0) / 4294967296;
    },
    nextRange: (min: number, max: number): number => {
      state = (state + 0x9e3779b9) | 0;
      const norm = ((state ^ (state >>> 16)) >>> 0) / 4294967296;
      return min + (max - min) * norm;
    },
  };
};
