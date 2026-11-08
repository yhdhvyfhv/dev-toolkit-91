type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };

export function loadConfig<T extends object>(defaults: T, overrides: DeepPartial<T>): T {
  const merge = (target: any, source: any): any => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
    return { ...target, ...source };
  };

  return merge({ ...defaults }, overrides);
}

export const gameConfigSchema = {
  graphics: { resolution: '1920x1080', vsync: true },
  audio: { volume: 0.8, sfx: true },
  network: { timeout: 5000, region: 'us-east' }
};

export type GameConfig = typeof gameConfigSchema;

// Usage Example:
// const mySettings = loadConfig(gameConfigSchema, { graphics: { vsync: false } });