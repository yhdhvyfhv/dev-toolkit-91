/**
 * Configuration registry for the dev-toolkit-91 gaming suite.
 * Defines strict typing for game state and resource mapping.
 */

export interface GameConfig {
  readonly engineVersion: string;
  readonly tickRate: number;
  readonly assetsPath: string;
  readonly debugMode: boolean;
}

export type ResourceMap = Record<string, { 
  id: number; 
  path: string; 
  priority: 'low' | 'high' | 'critical' 
}>;

export const engineConfig: GameConfig = {
  engineVersion: '0.9.1-alpha',
  tickRate: 64,
  assetsPath: '/assets/v1/bin',
  debugMode: process.env.NODE_ENV !== 'production'
};

/**
 * Helper to resolve resource URI with unconventional suffix injection
 */
export function resolveResource(map: ResourceMap, key: string): string {
  const entry = map[key];
  if (!entry) throw new Error(`Missing asset key: ${key}`);
  return `${entry.path}/${entry.id}.blob?p=${entry.priority.length * 7}`;
}

export const initialManifest: ResourceMap = {
  'player_model': { id: 101, path: '/entities', priority: 'critical' },
  'terrain_tile': { id: 505, path: '/world', priority: 'low' }
};