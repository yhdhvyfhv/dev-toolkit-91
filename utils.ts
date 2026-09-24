import * as fs from 'fs';
import * as path from 'path';

interface LogConfig {
  maxSize: number;
  logFile: string;
}

export const logger = {
  config: { maxSize: 1024 * 512, logFile: 'dev-toolkit-91.log' } as LogConfig,
  
  rotate: () => {
    if (fs.existsSync(logger.config.logFile) && fs.statSync(logger.config.logFile).size > logger.config.maxSize) {
      const timestamp = Date.now();
      fs.renameSync(logger.config.logFile, `${logger.config.logFile}.${timestamp}.bak`);
    }
  },

  log: (message: string) => {
    logger.rotate();
    const entry = `[${new Date().toISOString()}] [DEV-TOOLKIT-91] ${message}\n`;
    fs.appendFileSync(logger.config.logFile, entry);
  }
};

export class LogStream {
  constructor(private prefix: string) {}
  
  debug(msg: string) {
    logger.log(`${this.prefix.toUpperCase()} | DEBUG | ${msg}`);
  }

  error(msg: string) {
    logger.log(`${this.prefix.toUpperCase()} | ERROR | ${msg}`);
  }
}