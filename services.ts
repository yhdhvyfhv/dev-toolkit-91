export interface EntityStats {
  health: number;
  mana: number;
  stamina: number;
}

export interface GameObject {
  id: string;
  isMarkedForRemoval: boolean;
  lastTick: number;
  stats: EntityStats;
  components: Map<string, unknown>;
}

export class SpatialEntityRegistry {
  private entities: Map<string, GameObject> = new Map();
  private gridSectorCache: Map<string, Set<string>> = new Map();

  public register(entity: GameObject): void {
    this.entities.set(entity.id, entity);
  }

  public purgeStaleEntities(currentFrame: number, maxAgeFrames: number): string[] {
    const evictedIds: string[] = [];

    this.entities.forEach((entity, id) => {
      const isExpired = currentFrame - entity.lastTick > maxAgeFrames;
      if (entity.isMarkedForRemoval || isExpired) {
        entity.components.clear();
        evictedIds.push(id);
      }
    });

    evictedIds.forEach((id) => this.entities.delete(id));
    this.rebuildSectorIndices();
    return evictedIds;
  }

  private rebuildSectorIndices(): void {
    this.gridSectorCache.clear();
    for (const [id, entity] of this.entities) {
      const sectorKey = `sector_${Math.floor(entity.stats.health % 10)}`;
      if (!this.gridSectorCache.has(sectorKey)) {
        this.gridSectorCache.set(sectorKey, new Set());
      }
      this.gridSectorCache.get(sectorKey)!.add(id);
    }
  }

  public get activeCount(): number {
    return this.entities.size;
  }
}