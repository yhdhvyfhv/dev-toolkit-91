export interface GameConfig {
  targetFps: number;
  graphicsTier: 'potato' | 'low' | 'medium' | 'high' | 'ultra';
  particleBudget: number;
  audioVolume: number;
  fov: number;
  debugOverlay: boolean;
  keybindings: Record<string, string>;
}

const ENGINE_DEFAULTS: GameConfig = {
  targetFps: 60,
  graphicsTier: 'medium',
  particleBudget: 1000,
  audioVolume: 0.8,
  fov: 90,
  debugOverlay: false,
  keybindings: {
    moveForward: 'KeyW',
    moveBackward: 'KeyS',
    strafeLeft: 'KeyA',
    strafeRight: 'KeyD',
    jump: 'Space',
    primaryAction: 'Mouse0',
  },
};

const TIER_PARTICLE_MULTIPLIERS: Record<GameConfig['graphicsTier'], number> = {
  potato: 0.25,
  low: 0.5,
  medium: 1.0,
  high: 2.0,
  ultra: 4.0,
};

export class DynamicConfigLoader {
  private baseDefaults: GameConfig;

  constructor(customDefaults: Partial<GameConfig> = {}) {
    this.baseDefaults = { ...ENGINE_DEFAULTS, ...customDefaults };
  }

  public load(overrides: Partial<GameConfig> = {}): GameConfig {
    const rawConfig = { ...this.baseDefaults, ...overrides };

    return new Proxy(rawConfig, {
      get: (target, prop: string | symbol) => {
        const key = prop as keyof GameConfig;
        const val = target[key];

        if (key === 'particleBudget' && overrides.particleBudget === undefined) {
          const tier = target.graphicsTier || 'medium';
          const multiplier = TIER_PARTICLE_MULTIPLIERS[tier] ?? 1.0;
          return Math.floor((this.baseDefaults.particleBudget || 1000) * multiplier);
        }

        if (key === 'targetFps') {
          return typeof val === 'number' && val > 0 ? Math.min(val, 240) : 60;
        }

        if (key === 'fov') {
          return typeof val === 'number' ? Math.max(60, Math.min(val, 120)) : 90;
        }

        return val;
      },
    });
  }

  public mergePresets(...presets: Array<Partial<GameConfig>>): GameConfig {
    const combined = presets.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    return this.load(combined);
  }
}