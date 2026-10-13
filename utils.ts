export type GameInput = { action: string; sequence: number; timestamp: number };

export const validateInput = (input: unknown): input is GameInput => {
  if (typeof input !== 'object' || input === null) return false;
  const { action, sequence, timestamp } = input as Record<string, unknown>;
  return (
    typeof action === 'string' &&
    action.length > 0 &&
    Number.isInteger(sequence) &&
    sequence >= 0 &&
    typeof timestamp === 'number' &&
    timestamp <= Date.now()
  );
};

export const processGameLoop = (inputQueue: unknown[]): void => {
  const now = Date.now();
  const safeQueue = inputQueue.filter(validateInput);
  
  for (const input of safeQueue) {
    const latency = now - input.timestamp;
    if (latency > 500) {
      console.warn(`Packet ${input.sequence} dropped: Latency ${latency}ms`);
      continue;
    }
    applyAction(input);
  }
};

const applyAction = (input: GameInput): void => {
  // Core engine hook for valid state mutations
  console.log(`Executing ${input.action} for sequence ${input.sequence}`);
};