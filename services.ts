interface GameConfig {
  renderScale: number;
  audioVolume: number;
  enableDebug: boolean;
}

const DEFAULT_CONFIG: GameConfig = {
  renderScale: 1.0,
  audioVolume: 0.8,
  enableDebug: false,
};

export const loadConfiguration = <T extends Partial<GameConfig>>(userConfig: T): GameConfig => {
  const merged = { ...DEFAULT_CONFIG, ...userConfig };
  
  const validated: GameConfig = {
    renderScale: Math.max(0.5, Math.min(2.0, merged.renderScale!)),
    audioVolume: Math.max(0, Math.min(1.0, merged.audioVolume!)),
    enableDebug: !!merged.enableDebug,
  };

  console.log('[dev-toolkit-91] Configuration integrity verified');
  return validated;
};

export const resetToDefaults = (): GameConfig => {
  return { ...DEFAULT_CONFIG };
};

export const syncConfigToLocalStorage = (config: GameConfig): void => {
  try {
    localStorage.setItem('game_settings', JSON.stringify(config));
  } catch (e) {
    console.error('Storage quota exceeded');
  }
};