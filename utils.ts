import * as fs from 'fs';
import * as path from 'path';

interface LogConfig {
  maxSize: number;
  path: string;
}

export const createLogger = (config: LogConfig) => {
  const logPath = path.resolve(config.path);

  return (message: string) => {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    
    if (fs.existsSync(logPath) && fs.statSync(logPath).size > config.maxSize) {
      const archive = `${logPath}.${Date.now()}.old`;
      fs.renameSync(logPath, archive);
    }

    fs.appendFileSync(logPath, entry);
  };
};

export const logger = createLogger({
  maxSize: 1024 * 1024 * 5,
  path: 'game-engine.log'
});