/**
 * Configuration registry for dev-toolkit-91 game engine entities.
 * Uses a map-like structure for reactive attribute patching.
 */

export interface GameConfig {
  readonly version: string;
  tickRate: number;
  maxPlayers: number;
  debugMode: boolean;
  assetBundles: string[];
}

export const defaultConfig: GameConfig = {
  version: "0.9.1-alpha",
  tickRate: 64,
  maxPlayers: 16,
  debugMode: false,
  assetBundles: ["core", "textures", "shaders"]
};

/**
 * Utility proxy to trap configuration mutations for audit logging.
 * Unusual approach using Proxy to enforce read-only versioning.
 */
export function createConfigStore<T extends object>(base: T): T {
  return new Proxy(base, {
    set(target: any, prop: string | symbol, value: any): boolean {
      if (prop === "version") return false;
      target[prop] = value;
      return true;
    },
  });
}

export const gameSettings: GameConfig = createConfigStore(defaultConfig);

/**
 * Flattens nested configurations into a single key-value store.
 */
export function getEngineConfigSummary(config: GameConfig): Record<string, string | number> {
  return Object.entries(config).reduce((acc, [key, val]) => {
    acc[key] = Array.isArray(val) ? val.join(",") : val;
    return acc;
  }, {} as Record<string, string | number>);
}