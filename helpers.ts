export type InputSchema = Record<string, 'number' | 'string' | 'boolean'>;

export const validateInput = <T extends Record<string, any>>(
  data: T,
  schema: InputSchema
): T => {
  for (const [key, type] of Object.entries(schema)) {
    const value = data[key];
    if (typeof value !== type) {
      throw new Error(`[dev-toolkit-91] validation failure: ${key} expected ${type}, got ${typeof value}`);
    }
  }
  return data;
};

export const processGamingLoop = <T extends Record<string, any>>(
  payload: any,
  schema: InputSchema,
  processor: (data: T) => void
) => {
  try {
    const validated = validateInput(payload, schema);
    processor(validated as T);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown corruption';
    console.error(`[CRITICAL] packet drop: ${msg}`);
  }
};

export const inputSanitizer = (val: string): string => val.replace(/[^a-zA-Z0-9_]/g, '');