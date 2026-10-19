export type GameEntity = { id: string; health: number; active: boolean };

export const filterActiveEntities = (entities: GameEntity[]): GameEntity[] => 
  entities.filter(e => e.active && e.health > 0);

export const chunkEntities = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => 
    arr.slice(i * size, i * size + size));

export class EntityRegistry {
  private store: Map<string, GameEntity> = new Map();

  constructor(initial: GameEntity[] = []) {
    initial.forEach(e => this.store.set(e.id, e));
  }

  public getActive = (): GameEntity[] => 
    filterActiveEntities(Array.from(this.store.values()));

  public updateHealth = (id: string, delta: number): void => {
    const entity = this.store.get(id);
    if (entity) {
      entity.health = Math.max(0, entity.health + delta);
      entity.active = entity.health > 0;
    }
  };

  public flush = (): void => this.store.clear();
}