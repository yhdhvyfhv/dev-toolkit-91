import * as fs from 'fs';
import * as path from 'path';

interface LogConfig {
  maxSizeBytes: number;
  logDir: string;
}

export class GameLogger {
  private path: string;
  private config: LogConfig = { maxSizeBytes: 1024 * 1024 * 5, logDir: './logs' };

  constructor(filename: string) {
    if (!fs.existsSync(this.config.logDir)) fs.mkdirSync(this.config.logDir);
    this.path = path.join(this.config.logDir, filename);
  }

  private rotate(): void {
    const backup = `${this.path}.old`;
    if (fs.existsSync(backup)) fs.unlinkSync(backup);
    fs.renameSync(this.path, backup);
  }

  public log(message: string): void {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    if (fs.existsSync(this.path) && fs.statSync(this.path).size > this.config.maxSizeBytes) {
      this.rotate();
    }
    fs.appendFileSync(this.path, entry);
  }
}