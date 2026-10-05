export type InputSchema<T> = { [K in keyof T]: (val: unknown) => val is T[K] };

export interface GameInput {
  action: 'jump' | 'shoot' | 'move';
  timestamp: number;
  vector: [number, number];
}

export const validateInput = <T>(schema: InputSchema<T>, data: unknown): T | null => {
  if (!data || typeof data !== 'object') return null;
  const keys = Object.keys(schema) as Array<keyof T>;
  const isValid = keys.every(key => (schema[key] as Function)((data as any)[key]));
  return isValid ? (data as T) : null;
};

export const inputRules: InputSchema<GameInput> = {
  action: (val): val is 'jump' | 'shoot' | 'move' => ['jump', 'shoot', 'move'].includes(val as string),
  timestamp: (val): val is number => typeof val === 'number' && val > 0,
  vector: (val): val is [number, number] => Array.isArray(val) && val.length === 2 && val.every(n => typeof n === 'number')
};

export function processFrame(rawInput: unknown) {
  const validated = validateInput(inputRules, rawInput);
  if (!validated) {
    console.warn('[dev-toolkit-91] Rejected corrupt input frame');
    return;
  }
  console.log(`Processing ${validated.action} at ${validated.timestamp}`);
}