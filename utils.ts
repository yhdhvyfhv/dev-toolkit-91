type TickCallback = () => void;

class PerformanceManager {
  private queue: TickCallback[] = [];
  private isProcessing = false;

  constructor(private budgetMs: number = 8) {}

  public schedule(task: TickCallback): void {
    this.queue.push(task);
    this.trigger();
  }

  private trigger(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    requestIdleCallback((deadline) => this.flush(deadline));
  }

  private flush(deadline: IdleDeadline): void {
    while (deadline.timeRemaining() > this.budgetMs && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) task();
    }
    if (this.queue.length > 0) {
      requestIdleCallback((d) => this.flush(d));
    } else {
      this.isProcessing = false;
    }
  }
}

export const gameTaskScheduler = new PerformanceManager();

export const memoizeState = <T extends object>(target: T): T => {
  const cache = new Map<keyof T, unknown>();
  return new Proxy(target, {
    get(obj, prop: keyof T) {
      if (!cache.has(prop)) {
        cache.set(prop, obj[prop]);
      }
      return cache.get(prop);
    },
    set(obj, prop: keyof T, value: any) {
      cache.delete(prop);
      obj[prop] = value;
      return true;
    }
  });
};