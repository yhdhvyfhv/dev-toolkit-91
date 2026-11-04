export interface GameInput {
  action: string;
  value: number;
  timestamp: number;
}

export const validateInput = (input: unknown): input is GameInput => {
  if (typeof input !== 'object' || input === null) return false;
  const { action, value, timestamp } = input as any;
  return (
    typeof action === 'string' &&
    action.length > 0 &&
    Number.isFinite(value) &&
    Number.isSafeInteger(timestamp)
  );
};

export const processInputLoop = (inputs: unknown[], callback: (i: GameInput) => void) => {
  for (const raw of inputs) {
    if (validateInput(raw)) {
      callback(raw);
    } else {
      console.warn('Malformed gaming packet discarded:', raw);
    }
  }
};

export const sanitizeInput = (input: GameInput): GameInput => ({
  ...input,
  value: Math.max(0, Math.min(100, input.value))
});