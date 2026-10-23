export interface GameGraphicsConfig {
  resolution: [number, number];
  fpsCap: number;
  vsync: boolean;
  shadowQuality: 'off' | 'low' | 'medium' | 'high' | 'ultra';
  rayTracing: boolean;
}

export interface GameAudioConfig {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  spatialAudio: boolean;
}

export interface GameEngineConfig {
  graphics: GameGraphicsConfig;
  audio: GameAudioConfig;
  tickRate: number;
  debugOverlay: boolean;
  maxPlayers: number;
}

const DEFAULT_GAMING_CONFIG: GameEngineConfig = {
  graphics: {
    resolution: [1920, 1080],
    fpsCap: 144,
    vsync: true,
    shadowQuality: 'high',
    rayTracing: false,
  },
  audio: {
    masterVolume: 0.8,
    sfxVolume: 1.0,
    musicVolume: 0.7,
    spatialAudio: true,
  },
  tickRate: 64,
  debugOverlay: false,
  maxPlayers: 16,
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export class ConfigLoader {
  private activeConfig: GameEngineConfig;

  constructor(overrides: DeepPartial<GameEngineConfig> = {}) {
    this.activeConfig = this.mergeWithDefaults(DEFAULT_GAMING_CONFIG, overrides);
  }

  private mergeWithDefaults<T extends Record<string, any>>(defaults: T, overrides: Record<string, any>): T {
    const result = { ...defaults };
    for (const key of Object.keys(overrides)) {
      const val = overrides[key];
      if (val !== undefined) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val) && typeof defaults[key] === 'object') {
          result[key as keyof T] = this.mergeWithDefaults(defaults[key], val);
        } else {
          result[key as keyof T] = val;
        }
      }
    }
    return result;
  }

  public get<K extends keyof GameEngineConfig>(key: K): GameEngineConfig[K] {
    return Object.freeze(structuredClone(this.activeConfig[key]));
  }

  public createReactiveProxy(onUpdate?: (updatedConfig: GameEngineConfig) => void): GameEngineConfig {
    const handler: ProxyHandler<any> = {
      get: (target, prop) => {
        const val = target[prop];
        return typeof val === 'object' && val !== null ? new Proxy(val, handler) : val;
      },
      set: (target, prop, value) => {
        target[prop] = value;
        if (onUpdate) onUpdate(this.activeConfig);
        return true;
      },
    };
    return new Proxy(this.activeConfig, handler);
  }
}