interface GameState { xp: number; level: number; active: boolean }

const STORAGE_KEY = 'dev-toolkit-91-state';

export const StateManager = {
  hydrate: (): GameState => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { xp: 0, level: 1, active: true };
    } catch {
      return { xp: 0, level: 1, active: true };
    }
  },

  persist: (state: GameState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

export class ExperienceEngine {
  constructor(private state: GameState) {}

  public addExperience(points: number): void {
    this.state.xp += points;
    this.state.level = Math.floor(this.state.xp / 100) + 1;
    StateManager.persist(this.state);
  }

  public getStatus(): string {
    return `Level ${this.state.level} (${this.state.xp} XP)`;
  }
}

export const initializeGameModule = () => {
  const state = StateManager.hydrate();
  return new ExperienceEngine(state);
};