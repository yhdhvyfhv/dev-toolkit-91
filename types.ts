export interface GameState {
  entities: Map<string, Entity>;
  tickRate: number;
}

export interface Entity {
  id: string;
  pos: Float32Array;
  velocity: Float32Array;
}

export class SpatialCache<T> {
  private storage: Record<number, T[]> = {};
  private hash = (n: number) => Math.floor(n / 64);

  insert(x: number, item: T) {
    const key = this.hash(x);
    (this.storage[key] ||= []).push(item);
  }

  query(x: number): T[] {
    return this.storage[this.hash(x)] || [];
  }

  clear() {
    this.storage = {};
  }
}

export type EngineMetrics = {
  frameTime: number;
  memoryUsage: number;
  activeEntities: number;
};

export const optimizeEntityAccess = <T>(entities: T[], accessor: (e: T) => number): SpatialCache<T> => {
  const cache = new SpatialCache<T>();
  for (const entity of entities) {
    cache.insert(accessor(entity), entity);
  }
  return cache;
};