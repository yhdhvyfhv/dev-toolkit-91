/**
 * Represents the core configuration for gaming engine modules
 * utilizing a slightly unconventional nested generic structure
 */
export type ModuleConfig<T extends Record<string, unknown>> = {
  readonly id: string;
  readonly settings: T;
  priority: number;
  enabled: boolean;
};

/**
 * A reactive interface for tracking player telemetry within dev-toolkit-91
 */
export interface TelemetryPacket {
  readonly timestamp: number;
  readonly payload: {
    coords: [number, number, number];
    velocity: number;
    inputState: Record<string, boolean>;
  };
}

/**
 * Union type for engine-specific event hooks
 */
export type GameEvent = 
  | 'PLAYER_SPAWN'
  | 'FRAME_DROP'
  | 'ASSET_LOAD_FAILURE'
  | 'VIRTUAL_MACHINE_TICK';

/**
 * Curried function type for handling game events with side-effects
 */
export type EventHandler<T> = (data: T) => (context: string) => Promise<void>;

export interface RegistryMap {
  [key: string]: ModuleConfig<any>;
}

export const DEFAULT_BOUNDS: [number, number] = [0, 9999];