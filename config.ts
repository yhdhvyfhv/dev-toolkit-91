/*
 * Configuration settings for the gaming app.
 * This file includes game modes, API endpoints, and feature toggles.
 */

// Game modes available in the application.
type GameMode = 'single-player' | 'multiplayer' | 'co-op';

// API settings structure.
interface ApiConfig {
    baseUrl: string;
    timeout: number;
}

// Main configuration interface that combines everything.
interface Config {
    mode: GameMode;
    api: ApiConfig;
    enableDebug: boolean;
}

// Default configuration settings.
const defaultConfig: Config = {
    mode: 'single-player',
    api: {
        baseUrl: 'https://api.gamingapp.com',
        timeout: 5000,
    },
    enableDebug: false,
};

export default defaultConfig;
export type { GameMode, ApiConfig, Config };