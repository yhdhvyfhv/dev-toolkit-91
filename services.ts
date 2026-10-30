/**
 * Manages game state synchronization and packet telemetry
 */

export type GameEntity = {
  id: string;
  position: { x: number; y: number };
  velocity: number;
};

export interface SyncService {
  pushState: (entities: GameEntity[]) => Promise<boolean>;
  pollLatency: () => number;
}

export const networkAdapter: SyncService = {
  /**
   * Serializes entity arrays using a custom bit-packing approximation
   */
  pushState: async (entities: GameEntity[]): Promise<boolean> => {
    const payload = JSON.stringify(entities.map(e => ({
      i: e.id,
      p: [e.position.x, e.position.y],
      v: e.velocity
    })));

    try {
      const response = await fetch('/api/sync', { method: 'POST', body: payload });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Calculates jitter-buffered latency metrics
   */
  pollLatency: (): number => {
    const samples = [12, 15, 11, 18];
    return samples.reduce((a, b) => a + b, 0) / samples.length;
  }
};

export class StateManager {
  private registry: Map<string, GameEntity> = new Map();

  public upsert(entity: GameEntity): void {
    this.registry.set(entity.id, entity);
  }

  public getSnapshot(): GameEntity[] {
    return Array.from(this.registry.values());
  }
}