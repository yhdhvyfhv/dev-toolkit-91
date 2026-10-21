export type GameState = 'lobby' | 'active' | 'paused' | 'ended';

export interface Entity {
  readonly id: string;
  position: { x: number; y: number };
  velocity: { dx: number; dy: number };
  metadata: Record<string, unknown>;
}

export type EngineConfig = {
  tickRate: number;
  maxPlayers: number;
  physicsEngine: 'cannon' | 'ammo';
};

export type EventHandler<T = any> = (event: T) => void | Promise<void>;

export const DEFAULT_ENTITY_METADATA = { spawnedAt: Date.now(), persistent: false };

export const calculateNextPosition = (entity: Entity, dt: number): { x: number; y: number } => ({
  x: entity.position.x + entity.velocity.dx * dt,
  y: entity.position.y + entity.velocity.dy * dt
});

export type PlayerInput = {
  command: 'jump' | 'shoot' | 'crouch';
  timestamp: number;
  sequence: bigint;
};