export type GameEntity = {
  id: string;
  position: [number, number, number];
  health: number;
  stamina: number;
  isAlive: boolean;
};

export type SanitizeResult<T> =
  | { success: true; data: T; recovered: false }
  | { success: true; data: T; recovered: true; anomaly: string }
  | { success: false; error: Error };

export class ResilienceKernel {
  private maxDeltaThresholdMs = 250;

  public sanitizeFrameDelta(deltaMs: number): number {
    if (!Number.isFinite(deltaMs) || deltaMs < 0) {
      return 16.667;
    }
    if (deltaMs > this.maxDeltaThresholdMs) {
      return this.maxDeltaThresholdMs;
    }
    return deltaMs;
  }

  public safeMutateEntity<T extends GameEntity>(
    entity: T,
    mutationFn: (draft: T) => void
  ): SanitizeResult<T> {
    const snapshot = JSON.stringify(entity);
    try {
      const draft = JSON.parse(snapshot) as T;
      mutationFn(draft);

      const [x, y, z] = draft.position;
      if (![x, y, z].every(Number.isFinite)) {
        draft.position = entity.position;
        return {
          success: true,
          data: draft,
          recovered: true,
          anomaly: `Non-finite coordinate detected on entity ${entity.id}`
        };
      }

      if (isNaN(draft.health) || draft.health < 0) draft.health = 0;
      if (isNaN(draft.stamina) || draft.stamina < 0) draft.stamina = 0;
      draft.isAlive = draft.health > 0;

      return { success: true, data: draft, recovered: false };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err : new Error(String(err))
      };
    }
  }
}