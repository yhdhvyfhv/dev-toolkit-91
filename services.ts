export type GameEvent = { id: string; payload: unknown };

export class GamingEngineError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'GamingEngineError';
  }
}

export const safeEventProcessor = <T>(
  processor: (data: T) => T,
  fallback: T
) => (input: unknown): T => {
  try {
    if (input === null || typeof input !== 'object') {
      throw new GamingEngineError('INVALID_PAYLOAD', 'Payload is not an object');
    }
    return processor(input as T);
  } catch (err) {
    const error = err instanceof GamingEngineError ? err : new GamingEngineError('UNHANDLED', 'Crash in engine');
    console.error(`[dev-toolkit-91] ${error.code}: ${error.message}`);
    return fallback;
  }
};

export const executeTick = safeEventProcessor<number>(
  (tick) => {
    if (tick < 0) throw new GamingEngineError('NEG_TICK', 'Negative frame index');
    return tick * 2;
  },
  0
);