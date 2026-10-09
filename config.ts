import { readFileSync, existsSync } from 'fs';

interface GameConfig {
  renderScale: number;
  maxFps: number;
  enableShaders: boolean;
}

const DEFAULT_CONFIG: GameConfig = {
  renderScale: 1.0,
  maxFps: 60,
  enableShaders: true
};

export const loadConfig = (path: string): GameConfig => {
  try {
    if (!existsSync(path)) return { ...DEFAULT_CONFIG };
    
    const raw = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<GameConfig>;
    
    return Object.keys(DEFAULT_CONFIG).reduce((acc, key) => {
      const k = key as keyof GameConfig;
      acc[k] = parsed[k] !== undefined ? parsed[k]! : DEFAULT_CONFIG[k];
      return acc;
    }, {} as GameConfig);
  } catch (err) {
    console.error('config corrupted, falling back to defaults');
    return { ...DEFAULT_CONFIG };
  }
};

export const activeConfig = loadConfig('./settings.json');