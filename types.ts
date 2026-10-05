export type EntityID = string | number;
export type Vector3 = [number, number, number];

export interface GameState {
  players: Map<EntityID, PlayerState>;
  entities: Set<EntityID>;
  tick: number;
}

export interface PlayerState {
  id: EntityID;
  position: Vector3;
  velocity: Vector3;
  health: number;
  metadata: Record<string, unknown>;
}

export type Payload<T> = {
  type: string;
  data: T;
  timestamp: number;
};

export interface EngineConfig {
  tickRate: number;
  maxPlayers: number;
  enablePhysics: boolean;
}

export const DEFAULT_CONFIG: EngineConfig = {
  tickRate: 64,
  maxPlayers: 128,
  enablePhysics: true,
};

export type ActionHandler<T> = (state: GameState, payload: T) => GameState;

export interface ServiceRegistry {
  register<T>(name: string, service: T): void;
  resolve<T>(name: string): T;
}

export class GameException extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'GameException';
  }
}