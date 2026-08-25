export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * clamp(amount, 0, 1);
}
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
export function normalizeVector(x: number, y: number): { x: number; y: number } {
  const length = Math.sqrt(x * x + y * y);
  if (length === 0) {
    return { x: 0, y: 0 };
  }
  return { x: x / length, y: y / length };
}
export function moveTowards(currentX: number, currentY: number, targetX: number, targetY: number, maxDelta: number): { x: number; y: number } {
  const dx = targetX - currentX;
  const dy = targetY - currentY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= maxDelta || distance === 0) {
    return { x: targetX, y: targetY };
  }
  const factor = maxDelta / distance;
  return {
    x: currentX + dx * factor,
    y: currentY + dy * factor
  };
}
export function createSeededRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
export interface GamePosition {
  x: number;
  y: number;
}
export function applyMovement(positions: GamePosition[], velocities: GamePosition[], delta: number): GamePosition[] {
  return positions.map((pos, index) => {
    const vel = velocities[index] ?? { x: 0, y: 0 };
    return {
      x: pos.x + vel.x * delta,
      y: pos.y + vel.y * delta
    };
  });
}
export function filterActive<T extends { isActive: boolean }>(items: T[]): T[] {
  return items.filter(item => item.isActive);
}
export function wrapCoordinates(x: number, y: number, boundX: number, boundY: number): GamePosition {
  return {
    x: ((x % boundX) + boundX) % boundX,
    y: ((y % boundY) + boundY) % boundY
  };
}
export function combineFlags(base: number, ...additional: number[]): number {
  return additional.reduce((acc, flag) => acc | flag, base);
}
export function hasAllFlags(flags: number, mask: number): boolean {
  return (flags & mask) === mask;
}