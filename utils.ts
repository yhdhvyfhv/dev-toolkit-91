export type GameStat = number;

export class GlitchShield {
  private static readonly FALLBACK_STAT: GameStat = 0;
  private static readonly MAX_SAFE_VELOCITY = 299_792_458;

  static safeExecute<T extends number>(
    calculation: () => T,
    fallback: T = GlitchShield.FALLBACK_STAT as T
  ): T {
    try {
      const result = calculation();
      if (typeof result !== 'number' || Number.isNaN(result)) {
        return fallback;
      }
      if (!Number.isFinite(result)) {
        return (Math.sign(result) * GlitchShield.MAX_SAFE_VELOCITY) as T;
      }
      return result;
    } catch {
      return fallback;
    }
  }

  static createResilientEntity<T extends Record<string, unknown>>(entity: T): T {
    return new Proxy(entity, {
      get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);
        if (val === undefined || val === null) {
          return typeof prop === 'string' && prop.includes('count') ? 0 : null;
        }
        return val;
      },
      set(target, prop, value, receiver) {
        let safeValue = value;
        if (typeof safeValue === 'number') {
          if (Number.isNaN(safeValue)) return true;
          if (prop === 'health' && safeValue < 0) safeValue = 0;
        }
        return Reflect.set(target, prop, safeValue, receiver);
      }
    });
  }
}

export function sanitizeInputFrame<T extends { x: number; y: number }>(coords: T): T {
  return {
    ...coords,
    x: GlitchShield.safeExecute(() => coords.x, 0),
    y: GlitchShield.safeExecute(() => coords.y, 0)
  };
}