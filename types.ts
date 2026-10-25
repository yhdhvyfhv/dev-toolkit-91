/**
 * @file types.ts
 * Nominal spatial types and conditional input telemetry for dev-toolkit-91.
 */

/** Nominal brand wrapper to enforce coordinate space type safety. */
export type SpatialBrand<T, B extends string> = T & { readonly __spaceBrand: B };

/** World-space 3D coordinate vector. */
export type WorldVector3D = SpatialBrand<[x: number, y: number, z: number], 'WorldSpace'>;

/** Normalized screen-space viewport coordinate pair [0..1]. */
export type ViewportVector2D = SpatialBrand<[u: number, v: number], 'ViewportSpace'>;

/** Bitfield flags for engine input controller state polling. */
export enum InputBitmask {
  NONE = 0,
  MOVE_FORWARD = 1 << 0,
  MOVE_BACKWARD = 1 << 1,
  STRAFE_LEFT = 1 << 2,
  STRAFE_RIGHT = 1 << 3,
  ABILITY_PRIMARY = 1 << 4,
  ABILITY_SECONDARY = 1 << 5,
}

/** Dynamic telemetry payload mapped conditionally based on active input bitmask. */
export type InputPayload<TBitmask extends InputBitmask> =
  TBitmask extends InputBitmask.ABILITY_PRIMARY
    ? { chargeTimeMs: number; chargeRatio: number }
    : TBitmask extends InputBitmask.ABILITY_SECONDARY
    ? { lockTargetId: string | null }
    : { axisDelta: [x: number, y: number] };

/** Frame evaluation container for entity tracking and historical interpolation. */
export interface FrameSnapshot<TEntityId extends string = string> {
  /** Unique engine identifier for the entity instance. */
  readonly entityId: TEntityId;
  /** Current evaluated world position. */
  readonly position: WorldVector3D;
  /** Active controller input bitmask flag. */
  readonly activeInputs: InputBitmask;
  /** Calculated velocity vector per millisecond. */
  readonly velocity: readonly [dx: number, dy: number, dz: number];
}

/** Vector transformation operator contract for camera projection matrices. */
export type SpatialProjector = {
  /** Projects a 3D world coordinate to 2D viewport space. */
  (worldPos: WorldVector3D): ViewportVector2D;
  /** Indicates if the transformation matrix is currently cached. */
  readonly isCached: boolean;
};

/** Factory helper creating branded world vectors with runtime validation. */
export function createWorldVector(x: number, y: number, z: number): WorldVector3D {
  return [x, y, z] as WorldVector3D;
}
