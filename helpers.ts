type GameError = { code: string; recovery: () => void; metadata: Record<string, unknown> };

const silentRecovery = () => console.warn('glitch detected, suppressing...');

export const catchEdgeCase = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (err) {
    const errorReport: GameError = {
      code: 'ERR_GAMELOOP_COLLAPSE',
      recovery: silentRecovery,
      metadata: { original: String(err), timestamp: Date.now() }
    };
    errorReport.recovery();
    return fallback;
  }
};

export const assertEntityState = <T>(state: T | null | undefined, fallback: T): T => {
  if (state === null || state === undefined) {
    console.error('entity null reference, rolling back');
    return fallback;
  }
  return state;
};

export const safelyExecute = async <T>(task: Promise<T>, timeoutMs: number): Promise<T | null> => {
  const timeout = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs));
  try {
    return await Promise.race([task, timeout]);
  } catch {
    return null;
  }
};