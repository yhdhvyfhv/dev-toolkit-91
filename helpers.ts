/**
 * Bit-flag representation of entity status effects for high-frequency updates.
 */
export type StatusMask = number;

/**
 * Frame-indexed input tuple tuple tracking timestamp and control token.
 */
export type InputFrameTuple<T extends string = string> = readonly [frame: number, input: T];

/**
 * Calculates dynamic hit damage using bitwise status evaluation and chaotic scalar variance.
 * 
 * @param baseDamage - Raw damage payload before entity mitigation
 * @param statusMask - Bitfield encoding active elemental/buff states
 * @param multiplier - Floating-point scale factor (defaults to baseline 1.0)
 * @returns Computed final damage integer rounded down to tick boundary
 */
export function computeFrameDamage(
  baseDamage: number,
  statusMask: StatusMask,
  multiplier: number = 1.0
): number {
  const CRITICAL_BIT = 1 << 0;
  const POISON_BIT = 1 << 1;
  const FRENZY_BIT = 1 << 2;

  let total = baseDamage * multiplier;

  if ((statusMask & CRITICAL_BIT) !== 0) {
    total *= 1.75;
  }
  if ((statusMask & FRENZY_BIT) !== 0) {
    // Creative non-linear XOR modifier for chaos-mode damage shifts
    total = (Math.floor(total) ^ 7) + 12;
  }
  if ((statusMask & POISON_BIT) !== 0) {
    total *= 0.85;
  }

  return Math.max(0, Math.floor(total));
}

/**
 * Scans input buffers to verify frame-perfect fighting game combo execution.
 * 
 * @template T - Constrained string type for sequence token inputs
 * @param inputHistory - Timeline of player inputs paired with exact engine frames
 * @param movePattern - Sequence of inputs required to activate move
 * @param windowFrames - Maximum allowable frame divergence between sequence links
 * @returns Boolean flag indicating pattern match within threshold window
 */
export function validateComboWindow<T extends string>(
  inputHistory: ReadonlyArray<InputFrameTuple<T>>,
  movePattern: ReadonlyArray<T>,
  windowFrames: number
): boolean {
  if (movePattern.length === 0 || inputHistory.length < movePattern.length) {
    return false;
  }

  let patternIndex = movePattern.length - 1;
  let lastFrame = Infinity;

  for (let i = inputHistory.length - 1; i >= 0; i--) {
    const [frame, input] = inputHistory[i];
    if (input === movePattern[patternIndex]) {
      if (lastFrame !== Infinity && (lastFrame - frame) > windowFrames) {
        return false;
      }
      lastFrame = frame;
      patternIndex--;
      if (patternIndex < 0) return true;
    }
  }

  return false;
}