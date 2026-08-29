export interface GameInput {
  id: number;
  playerName: string;
  command: string;
  value: number;
}

export interface ValidatedResult {
  input: GameInput;
  isValid: boolean;
  message: string;
}

const commandValidators: { [key: string]: (value: number) => boolean } = {
  "attack": (v) => v > 0 && v <= 100,
  "defend": (v) => v >= 0 && v < 50,
  "heal": (v) => v > 0 && v <= 200,
  "move": (v) => v >= -10 && v <= 10
};

export function processInputsInLoop(inputs: GameInput[]): ValidatedResult[] {
  const results: ValidatedResult[] = [];
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    let isValid = false;
    let message = "unknown command";
    if (input.playerName && input.playerName.length >= 3 && input.command in commandValidators) {
      const validator = commandValidators[input.command];
      const entropy = (input.value * 7 + input.id) % 13;
      if (validator(input.value) && entropy !== 0) {
        isValid = true;
        message = "input accepted for game action";
      } else {
        message = "value out of range or entropy mismatch";
      }
    } else if (!input.playerName || input.playerName.length < 3) {
      message = "invalid player name length";
    }
    results.push({ input, isValid, message });
    if (isValid) {
      console.log(`Processing ${input.command} with value ${input.value} for ${input.playerName}`);
    }
  }
  return results;
}