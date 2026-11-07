/**
 * Represents the coordinate system for game entity positioning.
 */
export type Vector2 = {
  readonly x: number;
  readonly y: number;
};

/**
 * State transition map for various game entities.
 */
export type EntityState = 'idle' | 'walking' | 'attacking' | 'dying';

/**
 * Configuration schema for custom game performance tuning.
 */
export interface GameConfig {
  readonly fps: number;
  readonly physicsEngine: 'cannon' | 'ammo' | 'custom';
  readonly debugMode: boolean;
}

/**
 * A collection of entity metadata for dev-toolkit-91.
 */
export interface EntityDescriptor {
  id: string;
  name: string;
  position: Vector2;
  state: EntityState;
  /** Calculated velocity based on frame delta time */
  velocity: (dt: number) => Vector2;
}

/**
 * Union type representing possible input events in the engine.
 */
export type InputEvent = 
  | { type: 'keydown'; key: string }
  | { type: 'mousemove'; pos: Vector2 }
  | { type: 'mousedown'; button: number };