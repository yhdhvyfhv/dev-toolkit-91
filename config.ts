import fs from 'fs';
import path from 'path';

interface GameConfig {
  resolution: string;
  volume: number;
  controls: { [key: string]: string };
}

const defaultConfig: GameConfig = {
  resolution: '1920x1080',
  volume: 80,
  controls: {
    jump: 'SPACE',
    shoot: 'CTRL'
  }
};

function loadConfig(customConfigPath: string): GameConfig {
  const configPath = path.resolve(customConfigPath);
  let userConfig: Partial<GameConfig>;

  try {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    userConfig = JSON.parse(configFile);
  } catch (error) {
    console.warn('Could not read config. Using defaults.');
    userConfig = {};
  }

  return { ...defaultConfig, ...userConfig };
}

export { loadConfig, GameConfig };