export interface LogEntry {
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'QUEST';
  message: string;
  meta?: Record<string, unknown>;
}

export class GameLogRotator {
  private logs: LogEntry[] = [];
  private currentSlot = 1;
  private readonly maxEntriesPerSlot: number;
  private readonly maxSlots: number;
  private readonly archive: Map<number, LogEntry[]> = new Map();

  constructor(maxEntriesPerSlot = 50, maxSlots = 3) {
    this.maxEntriesPerSlot = maxEntriesPerSlot;
    this.maxSlots = maxSlots;
  }

  public log(level: LogEntry['level'], message: string, meta?: Record<string, unknown>): void {
    const entry: LogEntry = { timestamp: Date.now(), level, message, meta };
    this.logs.push(entry);

    if (this.logs.length >= this.maxEntriesPerSlot) {
      this.rotate();
    }
  }

  private rotate(): void {
    this.archive.set(this.currentSlot, [...this.logs]);
    this.logs = [];
    this.currentSlot = (this.currentSlot % this.maxSlots) + 1;
    console.warn(`[SYSTEM] Log rotation triggered. Active slot is now ${this.currentSlot}`);
  }

  public dumpSlot(slot: number): LogEntry[] {
    return this.archive.get(slot) || (slot === this.currentSlot ? this.logs : []);
  }

  public getActiveLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const gameLogger = new GameLogRotator(30, 4);