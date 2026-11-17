export type GameState = { score: number; level: number };

export class GamingEngineError extends Error {
  constructor(public code: string, message: string, public context?: Record<string, unknown>) {
    super(message);
    this.name = 'GamingEngineError';
  }
}

export const safeLoadGameState = (data: unknown): GameState => {
  try {
    if (typeof data !== 'object' || data === null) throw new Error('Malformed input');
    const state = data as GameState;
    if (typeof state.score !== 'number' || state.score < 0) throw new Error('Invalid score');
    if (typeof state.level !== 'number' || state.level < 1) throw new Error('Invalid level');
    return state;
  } catch (err) {
    throw new GamingEngineError('ERR_STATE_CORRUPT', 'Critical data integrity failure', { data, error: err });
  }
};

export const recoverState = (error: unknown): GameState => {
  if (error instanceof GamingEngineError && error.code === 'ERR_STATE_CORRUPT') {
    console.warn('Attempting emergency state recovery...');
    return { score: 0, level: 1 };
  }
  throw error instanceof Error ? error : new Error('Unknown catastrophic failure');
};