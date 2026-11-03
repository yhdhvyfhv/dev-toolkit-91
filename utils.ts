/**
 * Core gaming utility belt for spatial partitioning and bitwise status effect calculations.
 *
 * @module gaming-utils
 */

/** Valid elemental affinity flags mapped to bit shifts. */
export type ElementalAffinity = 'fire' | 'water' | 'earth' | 'air' | 'shadow' | 'holy';

/** Branded nominal type for packed spatial hash coordinates. */
export type SpatialHash = string & { readonly __brand: unique symbol };

/** Representation of an entity's 3D integer coordinate in grid units. */
export type GridCoord3D = readonly [x: number, y: number, z: number];

/** Map of elemental types to bit position offsets. */
const AFFINITY_OFFSETS: Readonly<Record<ElementalAffinity, number>> = {
  fire: 0,
  water: 1,
  earth: 2,
  air: 3,
  shadow: 4,
  holy: 5,
};

/**
 * Computes a spatial hash string from 3D coordinates for fast broad-phase collision lookups.
 *
 * @param coord - The [x, y, z] grid coordinate tuple.
 * @returns A unique branded spatial hash string.
 */
export function encodeSpatialHash(coord: GridCoord3D): SpatialHash {
  const [x, y, z] = coord;
  const packed = ((x & 0x3ff) << 20) | ((y & 0x3ff) << 10) | (z & 0x3ff);
  return (packed >>> 0).toString(36) as SpatialHash;
}

/**
 * Packs active elemental affinities into a single bitmask integer.
 *
 * @param affinities - Array of active elemental flags.
 * @returns A 32-bit unsigned integer bitmask.
 */
export function packAffinityMask(affinities: readonly ElementalAffinity[]): number {
  return affinities.reduce<number>((mask, affinity) => {
    return mask | (1 << AFFINITY_OFFSETS[affinity]);
  }, 0) >>> 0;
}

/**
 * Checks if a specific affinity bit is enabled within a packed affinity bitmask.
 *
 * @param mask - The 32-bit bitmask integer.
 * @param affinity - The affinity flag to verify.
 * @returns True if the target affinity is present in the bitmask.
 */
export function hasAffinity(mask: number, affinity: ElementalAffinity): boolean {
  return (mask & (1 << AFFINITY_OFFSETS[affinity])) !== 0;
}

/**
 * Calculates dynamic damage multiplier based on elemental advantage matrix bitwise evaluation.
 *
 * @param attackerMask - Attacker's active affinity bitmask.
 * @param defenderMask - Defender's active affinity bitmask.
 * @returns Calculated float multiplier.
 */
export function computeAffinityMultiplier(attackerMask: number, defenderMask: number): number {
  let multiplier = 1.0;
  if ((attackerMask & 1) && (defenderMask & 2)) multiplier += 0.5;
  if ((attackerMask & 2) && (defenderMask & 1)) multiplier += 0.75;
  if ((attackerMask & 16) && (defenderMask & 32)) multiplier += 1.0;
  return multiplier;
}