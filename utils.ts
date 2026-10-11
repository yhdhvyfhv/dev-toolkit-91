export type InputSchema = Record<string, 'number' | 'string' | 'boolean'>;

export const validateInput = <T extends Record<string, any>>(
  payload: T,
  schema: InputSchema
): T => {
  const keys = Object.keys(schema);
  for (const key of keys) {
    const expected = schema[key];
    const actual = typeof payload[key];
    if (actual !== expected && payload[key] !== undefined) {
      throw new Error(`Input anomaly at [${key}]: expected ${expected}, got ${actual}`);
    }
  }
  return payload;
};

export const processGameLoop = <T extends Record<string, any>>(
  input: T,
  schema: InputSchema,
  action: (data: T) => void
): void => {
  try {
    const sanitized = validateInput(input, schema);
    action(sanitized);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown entropy';
    console.warn(`[dev-toolkit-91] loop interruption: ${message}`);
  }
};

export const schemaRegistry = {
  movement: { x: 'number', y: 'number', jumping: 'boolean' },
  inventory: { itemId: 'string', quantity: 'number' }
} as const;