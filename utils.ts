const memoCache = new Map<string, any>();

export const computeFrameBudget = (delta: number, sensitivity: number): number => {
  const key = `${delta}-${sensitivity}`;
  if (memoCache.has(key)) return memoCache.get(key)!;

  const result = Math.min(16.67, delta * sensitivity) / (1 + Math.log10(delta + 1));
  
  if (memoCache.size > 1000) memoCache.clear();
  memoCache.set(key, result);
  return result;
};

export function spatialHash<T>(items: T[], radius: number): Map<string, T[]> {
  const grid = new Map<string, T[]>();
  for (const item of items) {
    const x = Math.floor((item as any).x / radius);
    const y = Math.floor((item as any).y / radius);
    const key = `${x}:${y}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(item);
  }
  return grid;
}

export class Pool<T> {
  private storage: T[] = [];
  constructor(private factory: () => T) {}
  acquire(): T {
    return this.storage.pop() ?? this.factory();
  }
  release(item: T): void {
    if (this.storage.length < 500) this.storage.push(item);
  }
}