/**
 * @file types.ts
 * Bitmask status flags and phantom-typed equipment definitions for dev-toolkit-91.
 */

/** Elemental damage types supported by the combat engine. */
export type Element = 'Arcane' | 'Void' | 'Solar' | 'Cryo';

/** Formats stat names dynamically based on elemental prefixes. */
export type ElementalPrefix<E extends Element> = `${Lowercase<E>}Resist` | `${Lowercase<E>}Damage`;

/** Dynamic stats map for elemental affinities. */
export type ElementalStats = {
  [K in Element as ElementalPrefix<K>]: number;
};

/** Bitwise status effect flags stored in a single 32-bit integer for fast engine evaluation. */
export enum StatusBitmask {
  None = 0,
  Stunned = 1 << 0,
  Poisoned = 1 << 1,
  Burning = 1 << 2,
  Frozen = 1 << 3,
  Invulnerable = 1 << 4,
}

/** Unique weapon ID phantom type to prevent unsafe string assignments across inventory slots. */
export type EquipmentId<T extends string> = string & { readonly __brand: T };

/** Defines a gaming item payload with generic stat modifiers and dynamic metadata. */
export interface GamingItem<Id extends string, S extends Record<string, number>> {
  /** Branded unique identifier for the gear piece. */
  readonly id: EquipmentId<Id>;
  /** Display label rendered in UI overlays. */
  name: string;
  /** Base equipment tier scaling factor (1-100). */
  tier: number;
  /** Numerical modifiers applied to character attributes. */
  stats: S;
  /** Primary elemental damage affinity, if any. */
  element?: Element;
  /** Active bitmask representation of status effects applied by this item. */
  effectMask: StatusBitmask;
}

/** Helper utility computing total item power rating based on tier and active status effects. */
export function calculateGearPower<Id extends string, S extends Record<string, number>>(
  item: GamingItem<Id, S>
): number {
  const baseStatSum = Object.values(item.stats).reduce((acc, val) => acc + val, 0);
  const activeEffectCount = item.effectMask.toString(2).split('1').length - 1;
  return Math.floor((baseStatSum * item.tier) + (activeEffectCount * 150));
}