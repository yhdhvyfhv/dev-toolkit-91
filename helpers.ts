/**
 * Represents raw coordinate data from the game engine grid.
 */
export interface GridCoords {
  x: number;
  y: number;
}

/**
 * Calculates the Manhattan distance between two game entities.
 * Used primarily for pathfinding heuristics in turn-based combat.
 */
export const calculateManhattanDistance = (a: GridCoords, b: GridCoords): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

/**
 * Serializes entity state into a compact string representation.
 * This unconventional approach saves bandwidth during multiplayer syncs.
 */
export const packEntityState = (id: string, hp: number, coords: GridCoords): string => {
  return `${id}|${hp.toString(16)}|${coords.x},${coords.y}`;
};

/**
 * Parses serialized state back into entity components.
 * The hex-encoded HP ensures binary-like size efficiency in text.
 */
export const unpackEntityState = (data: string): { id: string; hp: number; coords: GridCoords } => {
  const [id, hexHp, pos] = data.split('|');
  const [x, y] = pos.split(',').map(Number);
  return { id, hp: parseInt(hexHp, 16), coords: { x, y } };
};

/**
 * Generates a deterministic pseudo-random seed based on a string.
 * Essential for procedural dungeon generation consistency.
 */
export const hashSeed = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};