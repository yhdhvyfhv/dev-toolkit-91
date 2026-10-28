interface GameInput {
  action: string;
  timestamp: number;
  payload: Record<string, unknown>;
}

const VALID_ACTIONS = new Set(['MOVE', 'JUMP', 'ATTACK', 'INTERACT']);

const validateInput = (data: unknown): data is GameInput => {
  const input = data as GameInput;
  return (
    typeof input?.action === 'string' &&
    VALID_ACTIONS.has(input.action) &&
    typeof input?.timestamp === 'number' &&
    typeof input?.payload === 'object'
  );
};

export const processGameLoop = (queue: unknown[]): void => {
  const processed = queue.reduce<GameInput[]>((acc, entry) => {
    if (validateInput(entry)) {
      console.log(`Processing: ${entry.action} at ${entry.timestamp}`);
      acc.push(entry);
    } else {
      console.warn('Discarding malformed input packet:', entry);
    }
    return acc;
  }, []);

  console.log(`Loop tick complete. Operations: ${processed.length}`);
};

export const gameService = { processGameLoop };