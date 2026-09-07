export type GameEntity = { id: string; health: number; x: number; y: number };

export const calculateDistance = (a: GameEntity, b: GameEntity): number => 
  Math.hypot(a.x - b.x, a.y - b.y);

export const throttle = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last > ms) {
      last = now;
      return fn(...args);
    }
  };
};

export const lerp = (start: number, end: number, alpha: number): number => 
  (1 - alpha) * start + alpha * end;

export const safeParseInt = (val: any, fallback: number): number => {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const wrapInEntity = (id: string, health: number = 100): GameEntity => ({
  id,
  health,
  x: 0,
  y: 0
});

export const batchUpdate = <T>(items: T[], fn: (item: T) => void) => {
  for (let i = 0; i < items.length; i++) {
    fn(items[i]);
  }
};