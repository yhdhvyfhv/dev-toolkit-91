export type GameEntity = { id: string; health: number; pos: [number, number] };

export const lerp = (start: number, end: number, alpha: number): number =>
  start + (end - start) * Math.max(0, Math.min(1, alpha));

export const throttle = <T extends (...args: any[]) => any>(fn: T, limit: number) => {
  let lastRun = 0;
  return (...args: Parameters<T>): ReturnType<T> | void => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      return fn(...args);
    }
  };
};

export const normalizeVector = (x: number, y: number): [number, number] => {
  const mag = Math.hypot(x, y);
  return mag > 0 ? [x / mag, y / mag] : [0, 0];
};

export const collisionBox = (a: GameEntity, b: GameEntity, size: number): boolean =>
  Math.abs(a.pos[0] - b.pos[0]) < size && Math.abs(a.pos[1] - b.pos[1]) < size;

export const sanitizeInput = (input: string): string =>
  input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));