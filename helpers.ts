export interface RawInputFrame {
  frameId: number;
  timestamp: number;
  buttons: number;
  axes: [number, number];
  playerId: string;
}

export interface ValidatedInputFrame extends RawInputFrame {
  isValid: boolean;
  sanitizedAxes: [number, number];
  flags: string[];
}

const BUTTON_MASK_ALL = 0b1111;

export function* processAndValidateInputs(
  rawInputs: RawInputFrame[],
  lastTimestamp = 0
): Generator<ValidatedInputFrame, void, unknown> {
  let prevTime = lastTimestamp;

  for (const raw of rawInputs) {
    const flags: string[] = [];
    let isValid = true;

    if (!raw.playerId || !/^player_[a-z0-9]{4,8}$/.test(raw.playerId)) {
      isValid = false;
      flags.push('INVALID_PLAYER_ID');
    }

    if (typeof raw.timestamp !== 'number' || raw.timestamp <= prevTime) {
      isValid = false;
      flags.push('TIMESTAMP_ANOMALY');
    } else {
      prevTime = raw.timestamp;
    }

    if ((raw.buttons & ~BUTTON_MASK_ALL) !== 0) {
      flags.push('UNKNOWN_BUTTON_BITS_STRIPPED');
    }
    const cleanButtons = raw.buttons & BUTTON_MASK_ALL;

    const clamp = (v: number) => Math.max(-1.0, Math.min(1.0, Number.isFinite(v) ? v : 0));
    const [x, y] = Array.isArray(raw.axes) && raw.axes.length === 2 ? raw.axes : [0, 0];
    if (Math.abs(x) > 1.0 || Math.abs(y) > 1.0) {
      flags.push('AXIS_CLAMPED');
    }

    yield {
      ...raw,
      buttons: cleanButtons,
      isValid,
      sanitizedAxes: [clamp(x), clamp(y)],
      flags
    };
  }
}