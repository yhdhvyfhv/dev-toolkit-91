/**
 * Configuration schema for the dev-toolkit-91 gaming suite.
 * Defines physics constants and engine environment variables.
 */

export type EngineMode = 'debug' | 'release' | 'stress';

export interface GamePhysicsConfig {
  readonly gravity: number;
  readonly dragCoefficient: number;
  readonly collisionSubsteps: number;
}

export interface ToolkitConfig {
  readonly version: string;
  readonly mode: EngineMode;
  readonly physics: GamePhysicsConfig;
  readonly assetPath: string;
}

/**
 * Factory for generating validated toolkit configurations.
 */
export const createConfig = (mode: EngineMode = 'release'): ToolkitConfig => ({
  version: '0.9.1-alpha',
  mode,
  physics: {
    gravity: 9.81,
    dragCoefficient: 0.047,
    collisionSubsteps: 8
  },
  assetPath: '/assets/data'
});

/**
 * Global application settings instance.
 */
export const appConfig: ToolkitConfig = createConfig();

/**
 * Utility for runtime parameter injection in gaming environments.
 */
export function patchPhysics<K extends keyof GamePhysicsConfig>(key: K, value: GamePhysicsConfig[K]): void {
  (appConfig.physics as any)[key] = value;
}