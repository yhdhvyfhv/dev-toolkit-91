export interface GameConfig {
    title: string;
    resolution: Resolution;
    audio: AudioSettings;
    controls: Controls;
}

export interface Resolution {
    width: number;
    height: number;
}

export interface AudioSettings {
    volume: number;
    mute: boolean;
}

export interface Controls {
    jump: string;
    moveLeft: string;
    moveRight: string;
    shoot: string;
}

const defaultConfig: GameConfig = {
    title: 'My Awesome Game',
    resolution: {
        width: 1920,
        height: 1080
    },
    audio: {
        volume: 80,
        mute: false
    },
    controls: {
        jump: 'Space',
        moveLeft: 'A',
        moveRight: 'D',
        shoot: 'LeftMouse'
    }
};

export const getConfig = (): GameConfig => defaultConfig;

export const updateConfig = (newConfig: Partial<GameConfig>): GameConfig => {
    return { ...defaultConfig, ...newConfig };
};
