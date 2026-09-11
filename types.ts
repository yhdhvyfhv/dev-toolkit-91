/**
 * core combat architecture for dev-toolkit-91
 * handles attribute scaling and entity lifecycle
 */

export type DamageType = 'physical' | 'arcane' | 'void' | 'kinetic';

export interface Stats {
  strength: number;
  agility: number;
  intellect: number;
}

export interface CombatEntity {
  id: string;
  name: string;
  stats: Stats;
  modifiers: Record<string, number>;
}

/**
 * calculate effective power level using base stats and modifiers
 */
export function getPowerLevel(entity: CombatEntity): number {
  const base = entity.stats.strength + entity.stats.agility + entity.stats.intellect;
  const multiplier = Object.values(entity.modifiers).reduce((acc, val) => acc + val, 1);
  return Math.floor(base * multiplier);
}

/**
 * polymorphic damage generator for game loop events
 */
export const executeCrit = <T extends CombatEntity>(
  attacker: T,
  type: DamageType,
  factor: number = 2.0
): { amount: number; type: DamageType } => {
  const raw = getPowerLevel(attacker);
  return {
    amount: Math.round(raw * factor * (Math.random() + 0.5)),
    type,
  };
};

type EntityRegistry = Map<string, CombatEntity>;

export const entityManifest: EntityRegistry = new Map();