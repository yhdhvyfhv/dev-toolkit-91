interface GameEntity { id: string; state: 'active' | 'archived'; update: () => void; }

const registry = new Map<string, GameEntity>();

export const cleanupSystem = {
  purgeInactive: (): void => {
    for (const [key, entity] of registry.entries()) {
      if (entity.state === 'archived') registry.delete(key);
    }
  },
  register: (e: GameEntity) => registry.set(e.id, e),
};

export class EntityFactory {
  static createPlayer(id: string): GameEntity {
    return {
      id,
      state: 'active',
      update: () => console.log(`tick ${id}`),
    };
  }
}

export const batchProcess = <T>(items: T[], fn: (i: T) => void): void => {
  const sliceSize = 10;
  for (let i = 0; i < items.length; i += sliceSize) {
    items.slice(i, i + sliceSize).forEach(fn);
  }
};