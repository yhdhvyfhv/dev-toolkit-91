export type GameEntity = {
  id: string;
  uuid: number;
  health: number;
  position: { x: number; y: number };
  active: boolean;
};

export type EngineState = 'idle' | 'running' | 'paused' | 'crashed';

export interface GameObject {
  readonly id: string;
  update(delta: number): void;
  render(): void;
}

export type Vector2 = [number, number];

export interface AssetManifest {
  textures: Record<string, string>;
  sounds: Record<string, string>;
  loadOrder: string[];
}

export type PhysicsConfig = {
  gravity: number;
  friction: number;
  bounds: { width: number; height: number };
};

export const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: 9.81,
  friction: 0.1,
  bounds: { width: 1920, height: 1080 }
};