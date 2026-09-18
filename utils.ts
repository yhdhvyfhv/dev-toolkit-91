export type GameResult<T> = { success: true; data: T } | { success: false; error: string; code: number };

export const catchGamingErrors = <T>(fn: () => T): GameResult<T> => {
  try {
    return { success: true, data: fn() };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown glitched state';
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as any).code : 500;
    
    console.warn(`[dev-toolkit-91] trap triggered: ${message}`);
    return { success: false, error: message, code: code as number };
  }
};

export const assertGameState = (condition: boolean, msg: string, code: number = 400): void => {
  if (!condition) {
    const glitch = new Error(msg) as Error & { code: number };
    glitch.code = code;
    throw glitch;
  }
};

export const safeExecute = async <T>(promise: Promise<T>): Promise<GameResult<T>> => {
  try {
    return { success: true, data: await promise };
  } catch (err) {
    return catchGamingErrors(() => { throw err; });
  }
};