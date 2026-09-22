export type GameEntity = { id: string; health: number; active: boolean };

export const calculateDamage = (base: number, critMultiplier: number = 1.5): number => 
  Math.floor(base * (Math.random() > 0.8 ? critMultiplier : 1));

export const filterActive = (entities: GameEntity[]): GameEntity[] => 
  entities.filter(({ active }) => active);

export const normalizeVector = (x: number, y: number): { x: number; y: number } => {
  const mag = Math.hypot(x, y);
  return mag > 0 ? { x: x / mag, y: y / mag } : { x: 0, y: 0 };
};

export const lerp = (start: number, end: number, alpha: number): number => 
  start + (end - start) * Math.max(0, Math.min(1, alpha));

export const generateId = (prefix: string = 'dev'): string => 
  `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export const sequenceActions = <T>(...fns: Array<(arg: T) => T>) => 
  (initial: T): T => fns.reduce((val, fn) => fn(val), initial);