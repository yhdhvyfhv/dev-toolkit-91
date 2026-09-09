import * as fs from 'fs';
import * as path from 'path';

interface LoggerConfig {
  logDir: string;
  maxSize: number;
}

export const createLogger = (config: LoggerConfig) => {
  if (!fs.existsSync(config.logDir)) fs.mkdirSync(config.logDir);

  return {
    log: (message: string) => {
      const logPath = path.join(config.logDir, 'gameplay.log');
      const entry = `[${new Date().toISOString()}] ${message}\n`;

      if (fs.existsSync(logPath) && fs.statSync(logPath).size > config.maxSize) {
        const backupPath = logPath.replace('.log', `.${Date.now()}.old`);
        fs.renameSync(logPath, backupPath);
      }

      fs.appendFileSync(logPath, entry);
    }
  };
};

export const logger = createLogger({
  logDir: path.join(__dirname, '..', 'logs'),
  maxSize: 1024 * 512
});