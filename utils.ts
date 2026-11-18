export interface GameInput {
  action: string;
  timestamp: number;
  vector: [number, number];
}

export const validateInput = (input: unknown): input is GameInput => {
  if (typeof input !== 'object' || input === null) return false;
  const { action, timestamp, vector } = input as any;
  return (
    typeof action === 'string' &&
    action.length > 0 &&
    Number.isFinite(timestamp) &&
    Array.isArray(vector) &&
    vector.length === 2 &&
    vector.every((n) => typeof n === 'number')
  );
};

export const processMainLoop = (queue: unknown[], processor: (i: GameInput) => void) => {
  const now = Date.now();
  for (const item of queue) {
    try {
      if (!validateInput(item)) throw new Error('Invalid input signature');
      if (now - item.timestamp > 5000) continue;
      processor(item);
    } catch (e) {
      console.error('[dev-toolkit-91] ingestion fault:', e);
    }
  }
};