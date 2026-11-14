export type GameState = 'lobby' | 'active' | 'paused' | 'ended';

interface GameEngine {
  tick: (delta: number) => void;
  cleanup: () => void;
}

class SessionManager implements GameEngine {
  private registry: Map<string, () => void> = new Map();

  public register(id: string, cleanupFn: () => void): void {
    this.registry.set(id, cleanupFn);
  }

  public tick(delta: number): void {
    console.log(`Processing tick with delta: ${delta}`);
  }

  public cleanup(): void {
    for (const [id, clean] of this.registry.entries()) {
      clean();
      this.registry.delete(id);
    }
    console.log('Session memory cleared');
  }
}

export const engine = new SessionManager();

export const initializeSystem = (state: GameState) => {
  console.log(`System init sequence for mode: ${state}`);
  engine.register('graphics', () => console.log('Graphics heap purged'));
  engine.register('physics', () => console.log('Physics collision cache cleared'));
};