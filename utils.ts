export type GameEntity = { id: string; health: number; power: number };

export const calculateCombatOutcome = (
  attacker: GameEntity,
  defender: GameEntity,
  modifier: number = 1.0
): { damage: number; result: GameEntity } => {
  const baseDamage = Math.max(0, attacker.power - (defender.health / 10));
  const totalDamage = Math.floor(baseDamage * modifier * (Math.random() * 0.5 + 0.75));
  
  return {
    damage: totalDamage,
    result: {
      ...defender,
      health: Math.max(0, defender.health - totalDamage)
    }
  };
};

export const batchNormalizeEntities = <T extends GameEntity>(
  entities: T[],
  maxCap: number
): T[] => {
  const totalPower = entities.reduce((acc, e) => acc + e.power, 0);
  const scalar = totalPower > maxCap ? maxCap / totalPower : 1;

  return entities.map(e => ({
    ...e,
    power: Math.round(e.power * scalar)
  }));
};

export const getEntityTier = (entity: GameEntity): 'common' | 'rare' | 'legendary' => {
  const score = entity.health + entity.power;
  if (score > 500) return 'legendary';
  if (score > 200) return 'rare';
  return 'common';
};