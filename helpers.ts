export interface FrameState {
  fps: number;
  deltaTime: number;
  playerCoords: [number, number, number];
  health: number;
}

export type SanitizeOptions = {
  maxDeltaTimeMs?: number;
  worldBounds?: [number, number];
  defaultHealth?: number;
};

export class TelemetryAnomalyError extends Error {
  constructor(public readonly metric: string, public readonly value: unknown) {
    super(`[dev-toolkit-91] Telemetry anomaly detected in field "${metric}": ${String(value)}`);
    this.name = 'TelemetryAnomalyError';
  }
}

/**
 * Creative resilience wrapper for game loop ticks.
 * Intercepts NaN, unexpected teleports, and deadlocks before rendering.
 */
export function guardFrameExecution(
  rawState: Partial<FrameState>,
  fallback: FrameState,
  options: SanitizeOptions = {}
): FrameState {
  const { maxDeltaTimeMs = 1000 / 15, worldBounds = [-10000, 10000], defaultHealth = 100 } = options;

  try {
    if (!rawState || typeof rawState !== 'object') {
      throw new TelemetryAnomalyError('rawState', rawState);
    }

    const deltaTime = Number.isNaN(rawState.deltaTime) || (rawState.deltaTime ?? -1) < 0
      ? fallback.deltaTime
      : Math.min(rawState.deltaTime!, maxDeltaTimeMs);

    const health = Number.isFinite(rawState.health)
      ? Math.max(0, Math.min(100, rawState.health!))
      : defaultHealth;

    const coords = rawState.playerCoords ?? fallback.playerCoords;
    const sanitizedCoords: [number, number, number] = coords.map((c, idx) => {
      if (!Number.isFinite(c)) return fallback.playerCoords[idx];
      return Math.min(Math.max(c, worldBounds[0]), worldBounds[1]);
    }) as [number, number, number];

    const fps = Math.round(1000 / Math.max(deltaTime, 0.001));

    return {
      fps,
      deltaTime,
      playerCoords: sanitizedCoords,
      health,
    };
  } catch (error) {
    if (error instanceof TelemetryAnomalyError) {
      console.warn(`[GlitchShield] Corrected invalid frame telemetry:`, error.message);
    }
    return { ...fallback };
  }
}