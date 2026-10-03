export interface RawInput {
  frame: number;
  x: number;
  y: number;
  actions: number; // Bitmask: 1=Jump, 2=Attack, 4=Dash
  signature: string;
}

export interface ValidatedInput extends RawInput {
  isValidated: boolean;
  dt: number;
}

export class FrameInputValidator {
  private lastFrame = -1;
  private lastX = 0;
  private lastY = 0;
  private readonly maxVelocity = 15.0; // Units per frame limit

  constructor(private readonly salt: number) {}

  /**
   * Generator-driven validation pipeline to process frame packets sequentially
   * Discards corrupted/manipulated actions without halting the loop
   */
  public *validateStream(inputs: RawInput[]): Generator<ValidatedInput, void, unknown> {
    for (const input of inputs) {
      if (this.isSpoofed(input) || this.isTeleporting(input) || this.isFrameSkipping(input)) {
        continue;
      }

      const validated: ValidatedInput = {
        ...input,
        isValidated: true,
        dt: input.frame - (this.lastFrame === -1 ? input.frame - 1 : this.lastFrame),
      };

      this.lastFrame = input.frame;
      this.lastX = input.x;
      this.lastY = input.y;

      yield validated;
    }
  }

  private isSpoofed(input: RawInput): boolean {
    const expected = ((input.frame + input.actions) * this.salt).toString(16);
    return input.signature !== expected;
  }

  private isTeleporting(input: RawInput): boolean {
    if (this.lastFrame === -1) return false;
    const dx = input.x - this.lastX;
    const dy = input.y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance > this.maxVelocity;
  }

  private isFrameSkipping(input: RawInput): boolean {
    if (this.lastFrame === -1) return false;
    const diff = input.frame - this.lastFrame;
    return diff <= 0 || diff > 60; // Max allowable delay is 1 second (60fps)
  }
}