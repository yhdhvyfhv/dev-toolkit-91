export type Vector3D = [number, number, number];

export interface EntityState {
  readonly id: string;
  position: Vector3D;
  velocity: Vector3D;
  health: number;
  metadata: Record<string, unknown>;
}

export interface TimelineSnapshot {
  readonly tick: number;
  readonly timestamp: number;
  entities: Map<string, EntityState>;
}

export type ActionPayloadMap = {
  MOVE: { delta: Vector3D };
  DAMAGE: { amount: number; sourceId: string };
  SPAWN: { entityType: string; initialPosition: Vector3D };
  DESPAWN: { reason: 'dead' | 'cleanup' | 'portal' };
};

export type GameActionType = keyof ActionPayloadMap;

export interface GameAction<T extends GameActionType = GameActionType> {
  readonly type: T;
  readonly payload: ActionPayloadMap[T];
  readonly tickExecuted: number;
}

export type Reverter<T extends GameActionType> = (
  state: EntityState,
  action: GameAction<T>
) => EntityState;

export type TimeRewinderRegistry = {
  [K in GameActionType]: Reverter<K>;
};

export interface TimelineConfig {
  maxTicksStored: number;
  compressionRatio: 0 | 0.25 | 0.5 | 0.75 | 1;
  interpolation: 'linear' | 'hermite' | 'bezier' | 'teleport';
}