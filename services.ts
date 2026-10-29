export type EventMask = number;

export interface GameEntity {
  id: string;
  tags: EventMask;
  stats: Map<string, number>;
}

export interface ActionPayload {
  sourceId: string;
  targetId: string;
  type: 'attack' | 'heal' | 'buff';
  magnitude: number;
}

export class CombatPipelineService {
  private static readonly TAG_CRITICAL = 1 << 0;
  private static readonly TAG_SHIELDED = 1 << 1;
  private static readonly TAG_POISONED = 1 << 2;

  private readonly modifiers: Array<(payload: ActionPayload, target: GameEntity) => ActionPayload> = [];

  public registerModifier(fn: (payload: ActionPayload, target: GameEntity) => ActionPayload): this {
    this.modifiers.push(fn);
    return this;
  }

  public executePipeline(initial: ActionPayload, target: GameEntity): ActionPayload {
    return this.modifiers.reduce(
      (current, transform) => transform(current, target),
      Object.freeze({ ...initial })
    );
  }

  public static createDefaultPipeline(): CombatPipelineService {
    return new CombatPipelineService()
      .registerModifier((payload, target) => {
        const isShielded = Boolean(target.tags & CombatPipelineService.TAG_SHIELDED);
        if (isShielded && payload.type === 'attack') {
          return { ...payload, magnitude: Math.max(0, payload.magnitude - 15) };
        }
        return payload;
      })
      .registerModifier((payload, target) => {
        const isCritical = Boolean(target.tags & CombatPipelineService.TAG_CRITICAL);
        if (isCritical && payload.type === 'attack') {
          return { ...payload, magnitude: Math.round(payload.magnitude * 1.5) };
        }
        return payload;
      });
  }
}
