export type GameResult<T> = { success: true; data: T } | { success: false; error: Error; code: string };

export class GamingEngineError extends Error {
  constructor(public message: string, public code: 'SYNC_FAIL' | 'ASSET_CORRUPT' | 'NET_TIMEOUT') {
    super(message);
    Object.setPrototypeOf(this, GamingEngineError.prototype);
  }
}

export const safeExecute = async <T>(task: () => Promise<T>): Promise<GameResult<T>> => {
  try {
    return { success: true, data: await task() };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    const code = (err as any)?.code || 'UNKNOWN_CRASH';
    console.error(`[dev-toolkit-91] failure detected: ${code}`, error);
    return { success: false, error, code };
  }
};

export const assertDomain = (condition: boolean, msg: string): void => {
  if (!condition) {
    throw new GamingEngineError(msg, 'SYNC_FAIL');
  }
};

type Handler<T> = (data: T) => void;

export const wrapEvent = <T>(handler: Handler<T>) => (data: T) => {
  try {
    handler(data);
  } catch (e) {
    console.warn('suppressed event anomaly', e);
  }
};