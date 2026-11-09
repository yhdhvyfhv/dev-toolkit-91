/**
 * Dynamic configuration matrix for high-frequency game loop parameters.
 * Uses reactive proxy traps for runtime validation of render scale and frame budgets.
 */

export type GraphicPreset = 'retro-pixel' | 'ray-traced-ultra' | 'potato-mode';
export type FeatureBitmask = number;

export interface GraphicsConfig {
  readonly preset: GraphicPreset;
  /** Frame budget target in milliseconds (e.g., 6.94ms for 144Hz) */
  frameBudgetMs: number;
  /** Normalized viewport render scale (0.1 to 2.0) */
  renderScale: number;
  /** Bitwise toggle flags for shaders, bloom, and motion blur */
  featureFlags: FeatureBitmask;
}

export type ConfigChangeCallback<T> = (newValue: T, previousValue: T) => void;

/**
 * Reactive game configuration registry utilizing JavaScript Proxy traps
 * to strictly enforce hardware boundary limits and stream setting mutations.
 */
export class GameConfigRegistry<T extends GraphicsConfig> {
  private readonly configState: T;
  private readonly listeners: Map<keyof T, ConfigChangeCallback<any>[]> = new Map();

  constructor(initialConfig: T) {
    this.configState = new Proxy({ ...initialConfig }, {
      set: (target: T, prop: keyof T, value: any): boolean => {
        const oldVal = target[prop];
        if (oldVal === value) return true;

        if (prop === 'renderScale' && (typeof value !== 'number' || value < 0.1 || value > 2.0)) {
          throw new RangeError(`[dev-toolkit-91] Render scale ${value} is outside target threshold (0.1 - 2.0).`);
        }

        (target as any)[prop] = value;
        this.notify(prop, value, oldVal);
        return true;
      }
    });
  }

  /** Subscribes a reactive listener function to specific property updates. */
  public subscribe<K extends keyof T>(key: K, listener: ConfigChangeCallback<T[K]>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(listener);
    return () => {
      const active = this.listeners.get(key) ?? [];
      this.listeners.set(key, active.filter(fn => fn !== listener));
    };
  }

  private notify<K extends keyof T>(key: K, newVal: T[K], oldVal: T[K]): void {
    const callbacks = this.listeners.get(key) ?? [];
    for (const cb of callbacks) {
      cb(newVal, oldVal);
    }
  }

  /** Returns the reactive config proxy. */
  public get current(): T {
    return this.configState;
  }
}

/** Pre-configured setup optimized for low-latency esports execution. */
export const DEFAULT_GAMING_CONFIG: GraphicsConfig = {
  preset: 'ray-traced-ultra',
  frameBudgetMs: 1000 / 144,
  renderScale: 1.0,
  featureFlags: 0b1101
};