export type GameInput = { action: string; intensity: number; timestamp: number };

const VALID_ACTIONS = ['jump', 'dash', 'attack', 'interact'] as const;

export const validateInput = (data: unknown): GameInput => {
  const input = data as GameInput;
  if (!input || typeof input !== 'object') throw new Error('invalid payload structure');
  
  if (!VALID_ACTIONS.includes(input.action as any)) {
    throw new Error(`unknown input action: ${input.action}`);
  }

  const intensity = Math.max(0, Math.min(1, input.intensity ?? 0));
  const timestamp = Date.now();

  return { action: input.action, intensity, timestamp };
};

export const processInputLoop = (queue: unknown[]) => {
  const validated = queue.map((raw) => {
    try {
      return validateInput(raw);
    } catch (e) {
      console.error('discarding corrupted input packet', e);
      return null;
    }
  }).filter(Boolean) as GameInput[];
  
  return validated;
};