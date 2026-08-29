/**
 * Branded type for safe entity identification in game
 */
export type EntityId = string & { readonly __brand: unique symbol };

/**
 * Core player stats allowing dynamic modifiers for creative gameplay
 */
export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  [modifier: string]: number;
}

/**
 * Main player type with full annotations
 */
export interface Player {
  id: EntityId;
  name: string;
  stats: PlayerStats;
  level: number;
}

/**
 * Rarity enum as union type for items
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Game item interface
 */
export interface GameItem {
  id: EntityId;
  name: string;
  rarity: ItemRarity;
  power: number;
}

/**
 * Possible actions using template literals for extensibility
 */
export type GameAction = `attack:${string}` | `use:${string}` | 'defend' | 'move';

/**
 * Computes effective power creatively by applying rarity and level factors
 */
export function calculateEffectivePower(item: GameItem, player: Player): number {
  const multipliers: Record<ItemRarity, number> = {
    common: 1.0,
    uncommon: 1.25,
    rare: 1.6,
    epic: 2.2,
    legendary: 3.5,
  };
  const base = item.power * multipliers[item.rarity];
  return base * (1 + player.level * 0.1);
}

/**
 * Type guard for distinguishing attack actions
 */
export function isAttackAction(action: GameAction): action is `attack:${string}` {
  return action.startsWith('attack:');
}

/**
 * Processes turn and returns computed value using types
 */
export function processTurn(player: Player, item: GameItem | null, action: GameAction): number {
  if (item && isAttackAction(action)) {
    return calculateEffectivePower(item, player) + player.stats.strength;
  }
  return player.stats.agility * 0.5;
}