export type StatusEffect = 'poison' | 'burn' | 'freeze' | 'stun' | 'haste' | 'stealth' | 'shield';

const STATUS_BITS: Record<StatusEffect, number> = {
  poison:  1 << 0,
  burn:    1 << 1,
  freeze:  1 << 2,
  stun:    1 << 3,
  haste:   1 << 4,
  stealth: 1 << 5,
  shield:  1 << 6,
};

export class GamingBitState {
  private mask: number = 0;

  constructor(initialFlags: StatusEffect[] = []) {
    initialFlags.forEach((flag) => this.add(flag));
  }

  public add(effect: StatusEffect): this {
    this.mask |= STATUS_BITS[effect];
    return this;
  }

  public remove(effect: StatusEffect): this {
    this.mask &= ~STATUS_BITS[effect];
    return this;
  }

  public has(effect: StatusEffect): boolean {
    return (this.mask & STATUS_BITS[effect]) !== 0;
  }

  public toggle(effect: StatusEffect): boolean {
    this.mask ^= STATUS_BITS[effect];
    return this.has(effect);
  }

  public activeEffects(): StatusEffect[] {
    return (Object.keys(STATUS_BITS) as StatusEffect[]).filter((e) => this.has(e));
  }

  public serialize(): string {
    return this.mask.toString(36);
  }

  public static deserialize(encoded: string): GamingBitState {
    const instance = new GamingBitState();
    instance.mask = parseInt(encoded, 36) || 0;
    return instance;
  }
}

export function createReactiveEntity<T extends object>(baseStats: T, statusState: GamingBitState) {
  return new Proxy(baseStats, {
    get(target, prop, receiver) {
      if (prop === '$status') return statusState;
      if (typeof prop === 'string' && prop.startsWith('is')) {
        const effect = prop.slice(2).toLowerCase() as StatusEffect;
        if (effect in STATUS_BITS) return statusState.has(effect);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}