export interface FrameInput {
  tick: number;
  buttons: number;
  axisX: number;
  axisY: number;
  signature: string;
}

export interface ValidatedInput extends FrameInput {
  isValid: boolean;
  sanitizedAxis: [number, number];
}

export class GameLoopValidator {
  private lastTick = -1;
  private readonly allowedMask = 0b1111;

  public *validateStream(inputs: FrameInput[]): Generator<ValidatedInput, void, unknown> {
    for (const raw of inputs) {
      const isTickLinear = raw.tick > this.lastTick && raw.tick - this.lastTick <= 10;
      const areButtonsValid = (raw.buttons & ~this.allowedMask) === 0;
      const isAxisXValid = Number.isFinite(raw.axisX) && Math.abs(raw.axisX) <= 1.0;
      const isAxisYValid = Number.isFinite(raw.axisY) && Math.abs(raw.axisY) <= 1.0;

      const expectedSig = (raw.tick ^ raw.buttons).toString(16);
      const isSigValid = raw.signature === expectedSig;

      const isValid = isTickLinear && areButtonsValid && isAxisXValid && isAxisYValid && isSigValid;

      if (isValid) {
        this.lastTick = raw.tick;
      }

      const clamp = (v: number) => Math.max(-1.0, Math.min(1.0, v || 0));

      yield {
        ...raw,
        isValid,
        sanitizedAxis: [clamp(raw.axisX), clamp(raw.axisY)]
      };
    }
  }
}

export function processGameInputLoop(rawInputs: FrameInput[]): ValidatedInput[] {
  const validator = new GameLoopValidator();
  const results: ValidatedInput[] = [];
  
  for (const validated of validator.validateStream(rawInputs)) {
    if (validated.isValid) {
      results.push(validated);
    }
  }

  return results;
}