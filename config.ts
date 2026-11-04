export type PerformanceProfile = 'potato' | 'competitive' | 'ultra';

export interface GameConfig {
  tickRate: number;
  fov: number;
  fpsCap: number;
  rayTracing: boolean;
  audioChannels: number;
  serverRegion: string;
}

const DEFAULTS: GameConfig = {
  tickRate: 64,
  fov: 90,
  fpsCap: 144,
  rayTracing: false,
  audioChannels: 32,
  serverRegion: 'auto-detect',
};

const PROFILE_PRESETS: Record<PerformanceProfile, Partial<GameConfig>> = {
  potato: { tickRate: 30, fov: 75, fpsCap: 60, rayTracing: false, audioChannels: 16 },
  competitive: { tickRate: 128, fov: 104, fpsCap: 300, rayTracing: false },
  ultra: { tickRate: 64, fov: 90, fpsCap: 120, rayTracing: true, audioChannels: 64 },
};

export class ConfigLoader {
  private cachedConfig: GameConfig;

  constructor(profile: PerformanceProfile = 'competitive', overrides: Partial<GameConfig> = {}) {
    const profileDefaults = PROFILE_PRESETS[profile] ?? {};
    this.cachedConfig = new Proxy(
      { ...DEFAULTS, ...profileDefaults, ...overrides },
      {
        get: (target, prop: keyof GameConfig) => {
          if (!(prop in target)) {
            console.warn(`[ConfigLoader] Unrecognized setting accessed: ${String(prop)}`);
          }
          return target[prop];
        },
      }
    );
  }

  public get<K extends keyof GameConfig>(key: K): GameConfig[K] {
    return this.cachedConfig[key];
  }

  public exportSnapshot(): Readonly<GameConfig> {
    return Object.freeze({ ...this.cachedConfig });
  }
}