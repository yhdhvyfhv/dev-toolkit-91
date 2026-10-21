export interface InputSchema {
  playerId: string;
  action: 'jump' | 'shoot' | 'crouch';
  timestamp: number;
}

export const validateInput = (input: unknown): InputSchema => {
  const data = input as Record<string, any>;
  if (typeof data?.playerId !== 'string' || data.playerId.length < 3) {
    throw new Error('invalid player identity detected');
  }
  const validActions = ['jump', 'shoot', 'crouch'];
  if (!validActions.includes(data?.action)) {
    throw new Error('illegal game action sequence attempt');
  }
  return data as InputSchema;
};

export const processGameLoop = (rawInputs: unknown[]) => {
  const safeQueue: InputSchema[] = [];
  for (const entry of rawInputs) {
    try {
      safeQueue.push(validateInput(entry));
    } catch (err) {
      console.error(`sanitization failure: ${(err as Error).message}`);
    }
  }
  return safeQueue;
};