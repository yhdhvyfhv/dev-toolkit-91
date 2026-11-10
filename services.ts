export type GameInput = { x: number; y: number; action: string };

const VALID_ACTIONS = new Set(['jump', 'attack', 'dash', 'crouch']);

export const processInput = (input: unknown): GameInput | null => {
  try {
    const raw = input as any;
    const isValidCoords = typeof raw?.x === 'number' && typeof raw?.y === 'number';
    const isValidAction = VALID_ACTIONS.has(raw?.action);

    if (!isValidCoords || !isValidAction) {
      console.warn('malformed input packet dropped', raw);
      return null;
    }

    return { x: raw.x, y: raw.y, action: raw.action };
  } catch (e) {
    return null;
  }
};

export const gameLoop = (queue: unknown[]) => {
  const processed = queue.map(processInput).filter((i): i is GameInput => i !== null);
  
  processed.forEach((cmd) => {
    // Dispatching to engine core
    const signature = `${cmd.action}:${cmd.x},${cmd.y}`;
    console.log(`[dev-toolkit-91] executing ${signature}`);
  });
};

export const validateStream = (data: unknown[]): void => {
  if (!Array.isArray(data)) throw new Error('invalid input stream format');
  gameLoop(data);
};