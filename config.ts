interface GameConfig {  playerName: string;  difficulty: 'easy' | 'medium' | 'hard';  resolution: { width: number; height: number; };  volume: number;}

const defaultConfig: GameConfig = {  playerName: 'Player1',  difficulty: 'medium',  resolution: { width: 1920, height: 1080 },  volume: 50};

const loadConfig = (configFile: string): GameConfig => {  try {    const fileContent = Deno.readTextFileSync(configFile);    const parsedConfig = JSON.parse(fileContent);    return { ...defaultConfig, ...parsedConfig };  } catch (error) {    console.error('Error loading config:', error);    return defaultConfig;  }};

export { loadConfig, defaultConfig, GameConfig };