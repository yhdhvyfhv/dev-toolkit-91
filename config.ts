export type GameInput = { action: string; intensity: number };

const validate = (input: unknown): input is GameInput => {
  const i = input as GameInput;
  return typeof i?.action === 'string' && typeof i?.intensity === 'number' && i.intensity >= 0 && i.intensity <= 1;
};

export const processInputLoop = (stream: unknown[]) => {
  const validInputs: GameInput[] = [];
  
  for (const packet of stream) {
    if (validate(packet)) {
      validInputs.push(packet);
    } else {
      console.warn('Malformed input detected in dev-toolkit-91 stream');
    }
  }

  return validInputs.map(input => ({
    ...input,
    timestamp: Date.now(),
    processed: true
  }));
};

export const CONFIG = {
  MAX_BUFFER_SIZE: 1024,
  INPUT_SCHEMA_VERSION: '1.0.0',
  FORCE_SYNC: false
};