import { createWriteStream, existsSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';

interface LogConfig {
  path: string;
  maxSize: number;
}

export const createLogger = (config: LogConfig) => {
  const logFile = join(config.path, 'dev-toolkit-91.log');
  const backupFile = join(config.path, 'dev-toolkit-91.bak');

  const rotate = () => {
    if (existsSync(logFile)) {
      const stats = require('fs').statSync(logFile);
      if (stats.size >= config.maxSize) {
        if (existsSync(backupFile)) unlinkSync(backupFile);
        renameSync(logFile, backupFile);
      }
    }
  };

  return {
    log: (msg: string) => {
      rotate();
      const entry = `[${new Date().toISOString()}] ${msg}\n`;
      const stream = createWriteStream(logFile, { flags: 'a' });
      stream.write(entry);
      stream.end();
    }
  };
};