export interface GameInput { playerId: string; action: string; timestamp: number; payload: Record<string, any> }

const SCHEMA_MAP: Record<string, (p: any) => boolean> = {
  move: (p) => typeof p.x === 'number' && typeof p.y === 'number',
  interact: (p) => typeof p.targetId === 'string',
  chat: (p) => typeof p.message === 'string' && p.message.length < 256
};

export class InputProcessor {
  private static readonly validator = (input: GameInput): boolean => {
    if (!input.playerId || !input.action) return false;
    return (SCHEMA_MAP[input.action] || (() => true))(input.payload);
  };

  public static processLoop(queue: GameInput[]): void {
    const results = queue.filter(this.validator);
    
    for (const input of results) {
      try {
        this.executeAction(input);
      } catch (err) {
        console.error(`Execution fail for ${input.playerId}: ${err}`);
      }
    }
  }

  private static executeAction(input: GameInput): void {
    console.log(`Processing ${input.action} for ${input.playerId}`);
  }
}

export const validateInput = (input: unknown): input is GameInput => {
  const i = input as GameInput;
  return !!(i && i.playerId && i.action && typeof i.timestamp === 'number');
};