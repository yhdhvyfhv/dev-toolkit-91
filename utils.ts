type GamingMetric = number | string;

export interface GameState {
  score: number;
  level: number;
  inventory: Record<string, number>;
}

/**
 * Flattens nested game state for telemetry reporting
 * Uses recursive descent for arbitrary object depth
 */
export const flattenGameState = (
  obj: any,
  prefix: string = '',
  res: Record<string, GamingMetric> = {}
): Record<string, GamingMetric> => {
  for (const key in obj) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenGameState(obj[key], path, res);
    } else {
      res[path] = obj[key];
    }
  }
  return res;
};

/**
 * Bitwise masking utility for entity flags
 */
export const createFlagMask = (flags: number[]): number =>
  flags.reduce((acc, flag) => acc | (1 << flag), 0);

export const checkFlag = (mask: number, bit: number): boolean =>
  (mask & (1 << bit)) !== 0;

export const sanitizeInput = (val: string): string =>
  val.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);