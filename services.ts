export interface GameInput { type: string; sequence: number; payload: Record<string, any>; }

const SCHEMA_REGISTRY: Record<string, (p: any) => boolean> = {
  move: (p) => typeof p.x === 'number' && typeof p.y === 'number',
  action: (p) => typeof p.id === 'string' && p.id.length > 0
};

export const processGameLoop = (inputBuffer: GameInput[]): void => {
  const validated = inputBuffer.filter((input) => {
    const validator = SCHEMA_REGISTRY[input.type];
    const isValid = !!validator && validator(input.payload);
    
    if (!isValid) {
      console.warn(`[dev-toolkit-91] Rejected malformed packet: ${input.sequence}`);
    }
    
    return isValid;
  });

  validated.forEach((cmd) => executeCommand(cmd));
};

const executeCommand = (cmd: GameInput): void => {
  console.log(`Executing ${cmd.type} at seq ${cmd.sequence}`);
};