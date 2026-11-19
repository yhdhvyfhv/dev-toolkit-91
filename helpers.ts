type Config = { resolution: string; fps: number; vsync: boolean };

const DEFAULT_CONFIG: Config = {
  resolution: '1920x1080',
  fps: 60,
  vsync: true,
};

export const loadConfig = <T extends Partial<Config>>(overrides: T): Config & T => {
  const config = { ...DEFAULT_CONFIG, ...overrides };
  
  const validate = (cfg: any) => {
    if (cfg.fps < 30) cfg.fps = 30;
    return cfg;
  };

  return validate(config);
};

export const persistConfig = (config: Config): void => {
  try {
    localStorage.setItem('game_config', JSON.stringify(config));
  } catch (e) {
    console.warn('storage access denied, using memory session');
  }
};

export const getConfig = (): Config => {
  const raw = localStorage.getItem('game_config');
  return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
};