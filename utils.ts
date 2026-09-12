export type GameInput = { id: string; action: string; intensity: number };

export class InputValidator {
  private static readonly MAX_INTENSITY = 1.0;
  private static readonly MIN_INTENSITY = 0.0;
  private static readonly VALID_ACTIONS = new Set(['jump', 'shoot', 'crouch', 'dash']);

  public static validate(input: unknown): input is GameInput {
    if (typeof input !== 'object' || input === null) return false;
    const { id, action, intensity } = input as Record<string, unknown>;

    return (
      typeof id === 'string' &&
      typeof action === 'string' &&
      this.VALID_ACTIONS.has(action) &&
      typeof intensity === 'number' &&
      intensity >= this.MIN_INTENSITY &&
      intensity <= this.MAX_INTENSITY
    );
  }
}

export function processLoop(queue: unknown[]): void {
  for (const raw of queue) {
    if (InputValidator.validate(raw)) {
      const { action, intensity } = raw;
      console.log(`Executing ${action} at ${intensity * 100}% power`);
    } else {
      console.warn('Malformed telemetry packet detected');
    }
  }
}