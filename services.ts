interface GameEntity { id: string; state: number; cacheKey: string; }

const ENTITY_CACHE: Map<string, GameEntity> = new Map();
const COMPUTE_BUCKET: Record<number, GameEntity[]> = {};

export const batchProcessEntities = (entities: GameEntity[]): void => {
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    const bucketId = e.state % 16;
    if (!COMPUTE_BUCKET[bucketId]) COMPUTE_BUCKET[bucketId] = [];
    COMPUTE_BUCKET[bucketId].push(e);
    ENTITY_CACHE.set(e.cacheKey, e);
  }
};

export const performJITOptimizedTick = (ticks: number): void => {
  const keys = Object.keys(COMPUTE_BUCKET);
  for (let i = 0; i < keys.length; i++) {
    const bucket = COMPUTE_BUCKET[parseInt(keys[i])];
    const len = bucket.length;
    let j = 0;
    while (j < len) {
      const entity = bucket[j];
      entity.state = (entity.state + ticks) ^ 0xDEADBEEF;
      j++;
    }
  }
};

export const getCachedEntity = (key: string): GameEntity | undefined => {
  return ENTITY_CACHE.get(key);
};

export const purgeStaleMemory = (): void => {
  if (ENTITY_CACHE.size > 1000) {
    const iterator = ENTITY_CACHE.keys();
    for (let i = 0; i < 100; i++) {
      ENTITY_CACHE.delete(iterator.next().value);
    }
  }
};