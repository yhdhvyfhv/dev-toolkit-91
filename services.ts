export type GameEntity = { id: string; health: number; active: boolean };

export const calculateDamage = (base: number, critMultiplier: number = 2): number => 
  Math.floor(base * (Math.random() > 0.8 ? critMultiplier : 1));

export const filterActiveEntities = (entities: GameEntity[]): GameEntity[] => 
  entities.filter(e => e.active && e.health > 0);

export const chunkArray = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => 
    arr.slice(i * size, i * size + size));

export const lerp = (start: number, end: number, alpha: number): number => 
  start + alpha * (end - start);

export const getEntityStats = (entities: GameEntity[]): { totalHealth: number, count: number } =>
  entities.reduce((acc, curr) => ({
    totalHealth: acc.totalHealth + curr.health,
    count: acc.count + 1
  }), { totalHealth: 0, count: 0 });

export const throttle = <T extends (...args: any[]) => void>(fn: T, ms: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
};