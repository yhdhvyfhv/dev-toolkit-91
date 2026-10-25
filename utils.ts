import * as fs from 'node:fs';
import * as path from 'node:path';

export interface LogEvent {
  tick: number;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'LOOT';
  message: string;
  payload?: Record<string, unknown>;
}

export class RotatingGameLogger {
  private currentBuffer: string[] = [];
  private sessionIndex = 0;
  private currentTick = 0;

  constructor(
    private readonly logDir: string,
    private readonly maxEntriesPerFile: number = 100,
    private readonly maxArchives: number = 5
  ) {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public record(level: LogEvent['level'], message: string, payload?: Record<string, unknown>): void {
    this.currentTick++;
    const timestamp = new Date().toISOString();
    const details = payload ? JSON.stringify(payload) : '';
    const formatted = `[TICK:${this.currentTick.toString().padStart(6, '0')}][${timestamp}][${level}] ${message} ${details}`;

    this.currentBuffer.push(formatted.trim());

    if (this.currentBuffer.length >= this.maxEntriesPerFile) {
      this.rotateSession();
    }
  }

  private rotateSession(): void {
    const filePath = path.join(this.logDir, `match_log_${Date.now()}_rev${this.sessionIndex}.log`);
    fs.writeFileSync(filePath, this.currentBuffer.join('\n'), 'utf-8');
    this.currentBuffer = [];
    this.sessionIndex++;

    this.pruneOldLogs();
  }

  private pruneOldLogs(): void {
    const files = fs.readdirSync(this.logDir)
      .filter((f) => f.startsWith('match_log_') && f.endsWith('.log'))
      .map((f) => path.join(this.logDir, f))
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);

    while (files.length > this.maxArchives) {
      const oldest = files.shift();
      if (oldest) fs.unlinkSync(oldest);
    }
  }

  public flush(): void {
    if (this.currentBuffer.length > 0) {
      this.rotateSession();
    }
  }
}