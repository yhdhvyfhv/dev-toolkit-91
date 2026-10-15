interface GameConfig { resolution: string; fps: number; vsync: boolean; }

const DEFAULT_CONFIG: GameConfig = {
  resolution: '1920x1080',
  fps: 144,
  vsync: true
};

export class ConfigLoader {
  private config: GameConfig;

  constructor(initialData: Partial<GameConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...initialData };
  }

  public get<K extends keyof GameConfig>(key: K): GameConfig[K] {
    return this.config[key];
  }

  public patch(updates: Partial<GameConfig>): void {
    this.config = Object.freeze({ ...this.config, ...updates });
  }

  public serialize(): string {
    return JSON.stringify(this.config, null, 2);
  }
}

export const gameService = {
  initialize: (data: Partial<GameConfig>) => new ConfigLoader(data),
  defaults: Object.freeze({ ...DEFAULT_CONFIG })
};