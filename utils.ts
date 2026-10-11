export type Task = () => void;

export const StatusFlags = {
  NONE: 0,
  INVULNERABLE: 1 << 0,
  STUNNED: 1 << 1,
  POISONED: 1 << 2,
  BERSERK: 1 << 3,
  STEAL_HEALTH: 1 << 4,
} as const;

export type StatusType = keyof typeof StatusFlags;

export class FrameScheduler {
  private queue: Array<{ task: Task; priority: number }> = [];

  schedule(task: Task, priority: number = 0): this {
    this.queue.push({ task, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    return this;
  }

  flush(budgetMs: number = 16): number {
    const start = performance.now();
    let executed = 0;

    while (this.queue.length > 0 && (performance.now() - start) < budgetMs) {
      const item = this.queue.shift();
      item?.task();
      executed++;
    }

    return executed;
  }
}

export const BitwiseStatus = {
  combine: (...effects: StatusType[]): number =>
    effects.reduce((acc, effect) => acc | StatusFlags[effect], StatusFlags.NONE),

  has: (mask: number, effect: StatusType): boolean =>
    (mask & StatusFlags[effect]) !== 0,

  toggle: (mask: number, effect: StatusType): number =>
    mask ^ StatusFlags[effect],

  active: (mask: number): StatusType[] =>
    (Object.keys(StatusFlags) as StatusType[]).filter(
      (key) => key !== 'NONE' && (mask & StatusFlags[key]) !== 0
    ),
};