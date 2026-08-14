export type Player = {
    id: string;
    name: string;
    score: number;
    level: number;
};

export type GameSettings = {
    resolution: string;
    fullScreen: boolean;
    volume: number;
};

export type GameState = {
    players: Player[];
    currentLevel: number;
    isGameActive: boolean;
};

export interface IGameService {
    initializeGame(settings: GameSettings): void;
    startGame(): void;
    pauseGame(): void;
    endGame(): void;
    addPlayer(player: Player): void;
    removePlayer(playerId: string): void;
};

export type Scoreboard = {
    leaderboard: Player[];
    recordScore(playerId: string, score: number): void;
};

export const defaultSettings: GameSettings = {
    resolution: '1920x1080',
    fullScreen: true,
    volume: 70,
};
