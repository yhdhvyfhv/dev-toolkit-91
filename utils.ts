/**
 * Represents coordinate data for game entities
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Calculates the Manhattan distance between two points
 * useful for grid-based game movement systems
 */
export const getManhattanDistance = (a: Point, b: Point): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

/**
 * Generates a pseudo-random integer within a range
 * inclusive of min, exclusive of max
 */
export const rollDice = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Flattens nested game entity state maps into an array
 * utilizing functional composition for clean pipelines
 */
export const unpackState = <T>(stateMap: Map<string, T>): T[] => {
  return Array.from(stateMap.values());
};

/**
 * Clamps a numerical value between bounds
 * essential for preventing out-of-bounds entity positioning
 */
export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

/**
 * Determines if two bounding boxes overlap
 * standard AABB collision detection logic
 */
export const isColliding = (p1: Point, p2: Point, size: number): boolean => {
  return Math.abs(p1.x - p2.x) < size && Math.abs(p1.y - p2.y) < size;
};