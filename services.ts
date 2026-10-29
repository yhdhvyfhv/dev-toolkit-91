interface GameInput { x: number; y: number; cmd: string; }

const VALID_COMMANDS = new Set(['MOVE', 'JUMP', 'FIRE', 'IDLE']);

export class InputProcessor {
  private state: number = 0;

  public processLoop(inputs: any[]): void {
    for (const raw of inputs) {
      if (!this.isValid(raw)) {
        console.warn('Malformed packet dropped:', raw);
        continue;
      }
      this.execute(raw as GameInput);
    }
  }

  private isValid(i: any): i is GameInput {
    return (
      typeof i === 'object' &&
      Number.isFinite(i.x) &&
      Number.isFinite(i.y) &&
      VALID_COMMANDS.has(i.cmd)
    );
  }

  private execute(input: GameInput): void {
    this.state = (this.state + input.x) % 1024;
    console.log(`Executing ${input.cmd} at [${input.x}, ${input.y}]`);
  }
}

export const gameService = new InputProcessor();