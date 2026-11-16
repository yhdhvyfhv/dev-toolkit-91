export type GameEntity = { id: string; x: number; y: number; active: boolean };

export const sanitizePositions = (entities: GameEntity[]): GameEntity[] => {
  return entities.filter((e) => e.active).map((e) => ({
    ...e,
    x: Math.round(e.x * 100) / 100,
    y: Math.round(e.y * 100) / 100
  }));
};

export class EntityPool {
  private pool: Map<string, GameEntity> = new Map();

  constructor(initial: GameEntity[]) {
    initial.forEach((e) => this.pool.set(e.id, e));
  }

  public broadcastUpdate(delta: number): GameEntity[] {
    return Array.from(this.pool.values()).map((e) => ({
      ...e,
      x: e.x + delta,
      y: e.y + delta
    }));
  }

  public get activeCount(): number {
    return [...this.pool.values()].filter((e) => e.active).length;
  }
}

export const createGameStateLogger = (prefix: string) => {
  return (msg: string) => console.log(`[${prefix.toUpperCase()}]: ${msg}`);
};