import * as fs from 'fs';
import * as path from 'path';

interface LogConfig {
  maxSize: number;
  logDir: string;
}

export class GameLogger {
  private path: string;
  constructor(private config: LogConfig) {
    this.path = path.join(config.logDir, 'dev-toolkit.log');
    if (!fs.existsSync(config.logDir)) fs.mkdirSync(config.logDir, { recursive: true });
  }

  private rotate(): void {
    const backup = `${this.path}.old`;
    if (fs.existsSync(this.path)) {
      fs.renameSync(this.path, backup);
    }
  }

  public log(message: string): void {
    const entry = `[${new Date().toISOString()}] [DEV-TOOLKIT-91] ${message}\n`;
    try {
      const stats = fs.existsSync(this.path) ? fs.statSync(this.path) : null;
      if (stats && stats.size > this.config.maxSize) {
        this.rotate();
      }
      fs.appendFileSync(this.path, entry);
    } catch (e) {
      console.error('logger filesystem failure', e);
    }
  }
}

export const toolkitLogger = new GameLogger({
  maxSize: 1024 * 1024 * 5,
  logDir: './logs'
});