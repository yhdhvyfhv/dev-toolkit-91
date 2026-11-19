export type GameState = Record<string, number | string | boolean>;

/**
 * hyper-compact binary-esque flag serialization for entity states
 * avoids expensive JSON.stringify for high-frequency game ticks
 */
export function packState(state: GameState): string {
  return Object.entries(state)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

export function unpackState(packed: string): GameState {
  return packed.split('|').reduce((acc, curr) => {
    const [key, val] = curr.split(':');
    const num = Number(val);
    acc[key] = isNaN(num) ? (val === 'true' ? true : val === 'false' ? false : val) : num;
    return acc;
  }, {} as GameState);
}

export function normalizeInput(input: number, deadzone: number = 0.15): number {
  const abs = Math.abs(input);
  return abs < deadzone ? 0 : Math.sign(input) * ((abs - deadzone) / (1 - deadzone));
}

export const lerp = (start: number, end: number, alpha: number): number => 
  start + (end - start) * Math.min(Math.max(alpha, 0), 1);