/**
 * math utilities for player coordinate transformations
 */

export interface Vec2 {
  x: number;
  y: number;
}

/**
 * calculates distance between two points using pythagorean theorem
 * returns raw distance for collision bounds
 */
export const getDistance = (p1: Vec2, p2: Vec2): number => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

/**
 * maps coordinate ranges into 0-1 normalized space
 */
export const normalizePoint = (val: number, min: number, max: number): number => (val - min) / (max - min);

/**
 * custom lerp implementation with optional clamp behavior
 */
export const lerp = (start: number, end: number, alpha: number, clamp: boolean = true): number => {
  const value = start + (end - start) * alpha;
  return clamp ? Math.min(Math.max(value, start), end) : value;
};

/**
 * random number generator seeded by custom frame intervals
 */
export const getRandomFrameSeed = (max: number): number => Math.floor(Math.random() * max);

/**
 * checks if coordinate resides within designated rect
 */
export const isInsideBounds = (p: Vec2, rect: { x: number; y: number; w: number; h: number }): boolean =>
  p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;