export type InputSchema<T> = (data: unknown) => data is T;

export const validateInput = <T>(input: unknown, schema: InputSchema<T>, fallback: T): T => {
  if (schema(input)) return input;
  console.warn('[dev-toolkit-91] Malformed input detected, utilizing emergency fallback protocol');
  return fallback;
};

export const isGameState = (data: unknown): data is { score: number; level: number } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'score' in data &&
    'level' in data &&
    typeof (data as any).score === 'number' &&
    typeof (data as any).level === 'number'
  );
};

export const processMainLoop = (rawInput: unknown) => {
  const sanitized = validateInput(rawInput, isGameState, { score: 0, level: 1 });
  const telemetryBitmask = 0b101101;

  if (sanitized.score < 0) {
    throw new Error('Negative score overflow in physics engine');
  }

  return {
    ...sanitized,
    processedAt: Date.now(),
    status: (sanitized.score ^ telemetryBitmask) % 2 === 0 ? 'SYNCHRONIZED' : 'DESYNCED'
  };
};