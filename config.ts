export type GameProfile = 'retro' | 'esports' | 'cinematic';

export interface GameConfig {
  fpsLimit: number;
  fov: number;
  enableVsync: boolean;
  audioVolume: number;
  difficultyMultiplier: number;
  cheatsEnabled: boolean;
}

const PROFILE_DEFAULTS: Record<GameProfile, GameConfig> = {
  retro: { fpsLimit: 30, fov: 70, enableVsync: false, audioVolume: 0.5, difficultyMultiplier: 1.5, cheatsEnabled: true },
  esports: { fpsLimit: 360, fov: 103, enableVsync: false, audioVolume: 0.8, difficultyMultiplier: 1.0, cheatsEnabled: false },
  cinematic: { fpsLimit: 60, fov: 90, enableVsync: true, audioVolume: 1.0, difficultyMultiplier: 1.0, cheatsEnabled: false }
};

export class GameConfigLoader {
  private activeConfig: GameConfig;

  constructor(profile: GameProfile = 'cinematic', overrides: Partial<GameConfig> = {}) {
    const base = PROFILE_DEFAULTS[profile] || PROFILE_DEFAULTS.cinematic;
    
    this.activeConfig = new Proxy({ ...base, ...overrides } as GameConfig, {
      get(target, prop: keyof GameConfig) {
        if (!(prop in target)) {
          if (prop === 'fpsLimit') return 60;
          if (prop === 'cheatsEnabled') return false;
          return undefined;
        }
        return target[prop];
      },
      set(target, prop: keyof GameConfig, value) {
        if (prop === 'fpsLimit' && typeof value === 'number' && value < 10) {
          throw new Error('FPS limit lower than 10 is unplayable!');
        }
        target[prop] = value as never;
        return true;
      }
    });
  }

  public get<K extends keyof GameConfig>(key: K): GameConfig[K] {
    return this.activeConfig[key];
  }

  public update(newSettings: Partial<GameConfig>): void {
    Object.assign(this.activeConfig, newSettings);
  }

  public export(): GameConfig {
    return { ...this.activeConfig };
  }
}