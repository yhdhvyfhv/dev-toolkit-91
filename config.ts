export type GameInput = { id: string; action: string; intensity: number };

export const validateInput = (data: unknown): GameInput => {
  const input = data as GameInput;
  if (typeof input?.id !== 'string' || input.id.length < 3) throw new Error('Invalid ID');
  if (typeof input?.intensity !== 'number' || input.intensity < 0 || input.intensity > 1) {
    input.intensity = Math.max(0, Math.min(1, input.intensity || 0));
  }
  return { ...input, action: input.action?.toLowerCase() || 'idle' };
};

export const processLoop = (queue: unknown[]) => {
  const results: GameInput[] = [];
  for (const raw of queue) {
    try {
      results.push(validateInput(raw));
    } catch (e) {
      console.warn('Dropping corrupted frame packet:', e);
    }
  }
  return results;
};

export const CONFIG_DEFAULTS = {
  MAX_FPS: 144,
  INPUT_BUFFER_SIZE: 1024,
  ENABLE_INPUT_SANITIZATION: true
};