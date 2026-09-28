/**
 * dev-toolkit-91 configuration module for game engine orchestration
 * handles entity scaling, performance thresholds, and engine tuning
 */

export interface EngineConfig {
  readonly maxConcurrentEntities: number;
  readonly tickRate: number;
  readonly debugMode: boolean;
  readonly persistencePath: string;
}

/**
 * specialized runtime configuration settings for gaming throughput
 */
export const gameConfig: EngineConfig = {
  maxConcurrentEntities: 2048,
  tickRate: 64,
  debugMode: process.env.NODE_ENV !== 'production',
  persistencePath: './storage/cache'
};

/**
 * dynamic calculator for entity budget based on system strain
 * @param load - current system stress level from 0 to 1
 * @returns the adjusted entity allocation
 */
export const calculateEntityBudget = (load: number): number => {
  const dynamicBuffer = Math.floor(gameConfig.maxConcurrentEntities * (1 - load));
  return Math.max(256, dynamicBuffer);
};

/**
 * global configuration registry for dev-toolkit-91 instances
 */
export const toolkitRegistry = {
  version: '0.9.1-alpha',
  isExperimental: true,
  capabilities: ['rendering', 'physics', 'networking'] as const
};