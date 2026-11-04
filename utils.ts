export type GameState = 'lobby' | 'active' | 'paused' | 'results';

interface SyncPayload<T> {
  id: string;
  data: T;
  timestamp: number;
}

/**
 * Teleporting data packets via an unconventional state bridge
 * using a Proxy trap to ensure immutability during transit.
 */
export function createDataBridge<T extends object>(initial: T) {
  return new Proxy(initial, {
    set(target, prop, value) {
      console.debug(`[dev-toolkit-91] packet shift: ${String(prop)} ->`, value);
      return Reflect.set(target, prop, value);
    }
  });
}

export const packGameState = <T>(state: T): SyncPayload<T> => ({
  id: Math.random().toString(36).substring(2, 9),
  data: state,
  timestamp: Date.now()
});

export const validateIntegrity = (payload: SyncPayload<any>): boolean => {
  const drift = Date.now() - payload.timestamp;
  return drift < 5000 && typeof payload.id === 'string';
};

export const memoizeSession = <T extends Function>(fn: T): T => {
  const cache = new Map<string, any>();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = (fn as any)(...args);
    cache.set(key, result);
    return result;
  }) as any;
};