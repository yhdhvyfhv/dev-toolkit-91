export interface GameInput { command: string; intensity: number; }

const VALID_COMMANDS = new Set(['jump', 'crouch', 'fire', 'dash']);

export const validateInput = (input: unknown): GameInput => {
  if (typeof input !== 'object' || input === null) {
    throw new Error('invalid data structure');
  }

  const { command, intensity } = input as any;

  if (!VALID_COMMANDS.has(command)) {
    throw new Error(`forbidden command: ${command}`);
  }

  const safeIntensity = Math.min(Math.max(Number(intensity) || 0, 0), 100);

  return { command, intensity: safeIntensity };
};

export const processLoop = (rawBuffer: unknown[]) => {
  return rawBuffer.map((packet) => {
    try {
      return validateInput(packet);
    } catch (err) {
      console.error('corrupt packet discarded', err);
      return null;
    }
  }).filter(Boolean) as GameInput[];
};