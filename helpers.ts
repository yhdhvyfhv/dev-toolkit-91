type EntityId = string | number;

interface GameAsset {
  id: EntityId;
  tags: Set<string>;
  load: () => Promise<void>;
}

export const sanitizeEntity = <T extends GameAsset>(entity: T): T => {
  const sanitized = { ...entity };
  sanitized.tags = new Set([...sanitized.tags].map((t) => t.toLowerCase().trim()));
  return sanitized;
};

export const assetLoaderPool = async (assets: GameAsset[]): Promise<void[]> => {
  const queue = assets.map((a) => a.load());
  return Promise.all(queue);
};

export const throttleExecution = <F extends (...args: any[]) => any>(fn: F, limit: number) => {
  let lastRun = 0;
  return (...args: Parameters<F>): ReturnType<F> | undefined => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      return fn(...args);
    }
  };
};

export const generateHash = (input: string): string => {
  return btoa(input).replace(/=/g, '').split('').reverse().join('');
};