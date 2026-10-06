interface GameConfig {
  renderScale: number;
  maxPlayers: number;
  debugMode: boolean;
}

const defaults: GameConfig = {
  renderScale: 1.0,
  maxPlayers: 16,
  debugMode: false
};

export class ConfigLoader {
  private static instance: GameConfig;

  public static load(overrides: Partial<GameConfig> = {}): GameConfig {
    this.instance = { ...defaults, ...overrides };
    return this.instance;
  }

  public static get(): GameConfig {
    if (!this.instance) {
      console.warn('Config not initialized, defaulting to base settings.');
      return { ...defaults };
    }
    return this.instance;
  }

  public static patch(updates: Partial<GameConfig>): void {
    this.instance = { ...this.instance, ...updates };
  }
}

export const getEngineConfig = (): GameConfig => ConfigLoader.get();