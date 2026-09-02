import * as fs from 'fs';
import * as path from 'path';

export class RotatingLogger {
  private logPath: string;
  private maxSize: number;
  private maxBackups: number;

  constructor(logPath: string, maxSize: number = 1024 * 1024, maxBackups: number = 5) {
    this.logPath = logPath;
    this.maxSize = maxSize;
    this.maxBackups = maxBackups;
  }

  log(level: string, message: string): void {
    const entry = this.formatEntry(level, message);
    if (this.needsRotation()) {
      this.rotateLogs();
    }
    fs.appendFileSync(this.logPath, entry);
  }

  private formatEntry(level: string, message: string): string {
    const ts = new Date().toISOString();
    return "[" + ts + "] " + level.toUpperCase() + ": " + message + "\n";
  }

  private needsRotation(): boolean {
    try {
      if (!fs.existsSync(this.logPath)) {
        return false;
      }
      const size = fs.statSync(this.logPath).size;
      return size >= this.maxSize;
    } catch (err) {
      return false;
    }
  }

  private rotateLogs(): void {
    const dirName = path.dirname(this.logPath);
    const baseName = path.basename(this.logPath);
    const nameWithoutExt = path.basename(baseName, path.extname(baseName));
    const extension = path.extname(baseName);

    for (let i = this.maxBackups; i > 1; i--) {
      const src = path.join(dirName, nameWithoutExt + "." + (i - 1) + extension);
      const dest = path.join(dirName, nameWithoutExt + "." + i + extension);
      if (fs.existsSync(src)) {
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        fs.renameSync(src, dest);
      }
    }

    const firstBackup = path.join(dirName, nameWithoutExt + ".1" + extension);
    if (fs.existsSync(this.logPath)) {
      if (fs.existsSync(firstBackup)) {
        fs.unlinkSync(firstBackup);
      }
      fs.renameSync(this.logPath, firstBackup);
    }
  }

  info(msg: string): void { this.log('info', msg); }
  warn(msg: string): void { this.log('warn', msg); }
  error(msg: string): void { this.log('error', msg); }

  gameEvent(event: string, details: string): void {
    this.log('game', event + " - " + details);
  }
}

export const setupLogger = (logPath: string = 'dev-toolkit-91.log'): RotatingLogger => {
  return new RotatingLogger(logPath, 1024 * 50, 3);
};