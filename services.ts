interface GameEntity { id: string; health: number; active: boolean; }

const registry: Map<string, GameEntity> = new Map();

export const entityService = {
  sync: (entities: GameEntity[]): void => {
    entities.forEach(e => registry.set(e.id, e));
  },
  prune: (threshold: number): string[] => {
    const removed: string[] = [];
    for (const [id, entity] of registry) {
      if (!entity.active || entity.health <= threshold) {
        registry.delete(id);
        removed.push(id);
      }
    }
    return removed;
  },
  snapshot: (): GameEntity[] => Array.from(registry.values())
};

export const stateOrchestrator = {
  performCleanup: (minHealth: number): void => {
    const victims = entityService.prune(minHealth);
    console.info(`[dev-toolkit-91] garbage collection cycle: ${victims.length} entities purged`);
  }
};