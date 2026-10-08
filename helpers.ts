export interface GameInput {
  tick: number;
  dx: number;
  dy: number;
  actions: string[];
  timestamp: number;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  sanitized?: GameInput;
}

export function validateLoopInput(
  input: unknown,
  lastTick: number,
  maxDeltaSpeed: number = 100
): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { valid: false, reason: 'Malformed frame payload' };
  }

  const packet = input as Partial<GameInput>;

  const rules = function* () {
    if (typeof packet.tick !== 'number' || packet.tick <= lastTick) {
      yield 'Out of order or duplicate tick sequence';
    }
    if (typeof packet.dx !== 'number' || typeof packet.dy !== 'number') {
      yield 'Missing or invalid movement coordinates';
    } else if (Math.abs(packet.dx) > maxDeltaSpeed || Math.abs(packet.dy) > maxDeltaSpeed) {
      yield 'Movement delta exceeds sanity threshold (teleportation attempt)';
    }
    if (!Array.isArray(packet.actions)) {
      yield 'Action registry must be an iterable list';
    } else if (packet.actions.length > 8) {
      yield 'Action packet spam threshold exceeded';
    }
  };

  const failures = Array.from(rules());
  if (failures.length > 0) {
    return { valid: false, reason: failures.join(' | ') };
  }

  const sanitized: GameInput = {
    tick: packet.tick!,
    dx: Number(packet.dx!.toFixed(4)),
    dy: Number(packet.dy!.toFixed(4)),
    actions: [...new Set(packet.actions)].filter((a): a is string => typeof a === 'string'),
    timestamp: typeof packet.timestamp === 'number' ? packet.timestamp : Date.now(),
  };

  return { valid: true, sanitized };
}