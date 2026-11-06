export type GameEntity = { id: string; x: number; y: number; health: number };

export const calculateDistance = (a: GameEntity, b: GameEntity): number => 
  Math.hypot(a.x - b.x, a.y - b.y);

export const normalizeVector = (x: number, y: number): [number, number] => {
  const mag = Math.sqrt(x * x + y * y) || 1;
  return [x / mag, y / mag];
};

export const interpolate = (start: number, end: number, alpha: number): number => 
  start + (end - start) * Math.max(0, Math.min(1, alpha));

export const generateId = (prefix: string = 'dev'): string => 
  `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export const throttle = <T extends (...args: any[]) => void>(fn: T, limit: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

export const clamp = (val: number, min: number, max: number): number => 
  Math.min(Math.max(val, min), max);

export const isColliding = (a: GameEntity, b: GameEntity, radius: number): boolean => 
  calculateDistance(a, b) < radius * 2;