export interface GameSettings {
  targetFps: number;
  fov: number;
  rayTracing: boolean;
  shadowQuality: 'low' | 'medium' | 'high' | 'ultra';
  audioChannels: number;
  customKeybinds: Record<string, string>;
}

const DEFAULT_GAMING_CONFIG: GameSettings = {
  targetFps: 144,
  fov: 90,
  rayTracing: false,
  shadowQuality: 'high',
  audioChannels: 64,
  customKeybinds: {
    jump: 'Space',
    crouch: 'LeftControl',
    reload: 'KeyR',
  },
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export class GameConfigLoader {
  private activeConfig: GameSettings;

  constructor(userOverrides: DeepPartial<GameSettings> = {}) {
    this.activeConfig = this.hydrateDefaults(DEFAULT_GAMING_CONFIG, userOverrides);
  }

  private hydrateDefaults<T extends Record<string, any>>(defaults: T, overrides: Record<string, any>): T {
    const result = { ...defaults };
    for (const key of Object.keys(overrides)) {
      const val = overrides[key];
      if (val !== undefined && val !== null) {
        if (typeof val === 'object' && !Array.isArray(val) && typeof defaults[key] === 'object') {
          result[key as keyof T] = this.hydrateDefaults(defaults[key], val);
        } else {
          result[key as keyof T] = val;
        }
      }
    }
    return result;
  }

  public getProxy(): GameSettings {
    return new Proxy(this.activeConfig, {
      get: (target, prop: string | symbol) => {
        if (typeof prop === 'string' && !(prop in target)) {
          console.warn(`[dev-toolkit-91] Accessing unconfigured setting: ${String(prop)}`);
        }
        return Reflect.get(target, prop);
      },
      set: (target, prop: string | symbol, value) => {
        if (prop === 'targetFps' && (typeof value !== 'number' || value < 30 || value > 360)) {
          throw new RangeError('[dev-toolkit-91] Target FPS must be between 30 and 360');
        }
        return Reflect.set(target, prop, value);
      },
    });
  }
}