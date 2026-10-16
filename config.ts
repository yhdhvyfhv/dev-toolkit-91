export type GameState = 'active' | 'paused' | 'loading' | 'crashed';

export class ConfigError extends Error {
  constructor(public code: string, message: string) {
    super(`[dev-toolkit-91] ${message}`);
    this.name = 'ConfigError';
  }
}

export interface ToolkitConfig {
  latencyThreshold: number;
  maxPlayers: number;
}

export const validateConfig = (cfg: Partial<ToolkitConfig>): ToolkitConfig => {
  const defaults: ToolkitConfig = { latencyThreshold: 150, maxPlayers: 64 };

  try {
    if (cfg.latencyThreshold !== undefined && (cfg.latencyThreshold < 0 || cfg.latencyThreshold > 1000)) {
      throw new ConfigError('INVALID_LATENCY', 'Threshold must be between 0 and 1000ms');
    }
    if (cfg.maxPlayers !== undefined && (cfg.maxPlayers < 1 || cfg.maxPlayers > 128)) {
      throw new ConfigError('INVALID_PLAYER_COUNT', 'Players must be between 1 and 128');
    }
    return { ...defaults, ...cfg } as ToolkitConfig;
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(`Runtime config fallback triggered: ${err.message}`);
      return defaults;
    }
    throw err;
  }
};

export const getGlobalConfig = (raw: unknown): ToolkitConfig => {
  if (typeof raw !== 'object' || raw === null) return validateConfig({});
  return validateConfig(raw as ToolkitConfig);
};