export type GameState = 'lobby' | 'active' | 'paused' | 'ended';

interface GameService {
  updateState: (newState: GameState) => void;
  executeTick: () => void;
}

class CoreEngine implements GameService {
  private state: GameState = 'lobby';

  constructor(private readonly tickRate: number = 60) {}

  public updateState(newState: GameState): void {
    this.state = newState;
    console.log(`[dev-toolkit-91] state transition to: ${this.state}`);
  }

  public executeTick(): void {
    const payload = { timestamp: Date.now(), state: this.state };
    this.processPhysics(payload);
  }

  private processPhysics(data: { timestamp: number, state: GameState }): void {
    if (data.state === 'active') {
      console.log(`physics processing at ${data.timestamp}ms`);
    }
  }
}

export const engine = new CoreEngine();

export const bootstrapEngine = (initialState: GameState): void => {
  engine.updateState(initialState);
  setInterval(() => engine.executeTick(), 1000 / 60);
};