const DEFAULT_RESOLUTION = { width: 1920, height: 1080 };
const MAX_PLAYERS = 100;
const ENABLE_DEBUG_MODE = process.env.DEBUG === 'true';

interface GameConfig {
    resolution: { width: number; height: number; };
    maxPlayers: number;
    debugMode: boolean;
}

const gameConfig: GameConfig = {
    resolution: DEFAULT_RESOLUTION,
    maxPlayers: MAX_PLAYERS,
    debugMode: ENABLE_DEBUG_MODE,
};

export { gameConfig, DEFAULT_RESOLUTION, MAX_PLAYERS };