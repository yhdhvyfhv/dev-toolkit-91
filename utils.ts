/**
 * Represents a game coordinate in 3D space.
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculates the manhattan distance between two points, 
 * commonly used for grid-based pathfinding in dev-toolkit-91.
 */
export const getGridDistance = (a: Vector3, b: Vector3): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
};

/**
 * A generator for unique entity identifiers based on high-resolution timestamps
 * and a bitwise seed for collision-resistant gaming objects.
 */
export function* entityIdGenerator(seed: number = 0): Generator<string> {
  let counter = seed;
  while (true) {
    yield `dev-tk-${(Date.now() ^ counter++).toString(16)}`;
  }
}

/**
 * Memoization decorator to cache physics calculation results 
 * preventing redundant expensive floating point arithmetic.
 */
export const cachePhysics = <T extends any[], R>(fn: (...args: T) => R) => {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};