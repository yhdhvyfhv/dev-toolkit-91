/**
 * @fileoverview Quantum-superposed entity state type matrix for dev-toolkit-91.
 * Expresses probabilistic state mutations and elemental affinity vectors.
 */

/** Nominal branding trick for type-safe game currency and experience points. */
export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };

export type Gold = Branded<number, "Gold">;
export type Mana = Branded<number, "Mana">;
export type Health = Branded<number, "Health">;

/** Elemental damage resonance vectors for spatial combat calculations. */
export type ElementType = "fire" | "frost" | "void" | "kinetic" | "overcharge";

/** Dynamic modifier matrix mapping elemental vectors to amplification coefficients. */
export type ElementalResonanceMatrix = {
  [K in ElementType]?: number;
};

/**
 * Entangled state payload representing an active combat entity's quantum state.
 * Utilizes branded primitives to prevent scalar bleed across stat calculations.
 */
export interface EntityQuantumState {
  /** Unique entity identifier */
  id: string;
  /** Instantaneous hit points */
  hp: Health;
  /** Instantaneous mana pool reserve */
  mp: Mana;
  /** Accumulated dynamic elemental resonance values */
  resonance: ElementalResonanceMatrix;
  /** Flag bitmask specifying active status effects */
  statusBitmask: number;
}

/**
 * Higher-order predicate constructor for filtering entities by status bitmask.
 * @param flag - Bitflag mask representing the status condition (e.g. 1 << 3 for Frozen)
 * @returns Predicate function validating if an entity matches the status mask
 */
export function hasStatusEffect(flag: number): (state: EntityQuantumState) => boolean {
  return (state: EntityQuantumState): boolean => (state.statusBitmask & flag) === flag;
}

/**
 * Infuses raw scalar amounts into branded currency/stat primitives with hard safety caps.
 * @param value - Scalar numerical input
 * @param cap - Upper boundary safety limit
 */
export function clampBranded<T extends Gold | Mana | Health>(value: number, cap: number): T {
  return Math.min(Math.max(0, value), cap) as T;
}