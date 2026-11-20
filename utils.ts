import * as fs from 'fs';
import * as path from 'path';

interface LoggerConfig {
  logDir: string;
  maxSize: number;
}

export const createLogger = ({ logDir, maxSize }: LoggerConfig) => {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const logFile = path.join(logDir, 'game-engine.log');

  const rotate = () => {
    const backup = path.join(logDir, `game-engine.${Date.now()}.old`);
    fs.renameSync(logFile, backup);
  };

  return {
    info: (msg: string) => {
      const entry = `[${new Date().toISOString()}] INFO: ${msg}\n`;
      if (fs.existsSync(logFile) && fs.statSync(logFile).size > maxSize) {
        rotate();
      }
      fs.appendFileSync(logFile, entry);
    }
  };
};

export const logger = createLogger({
  logDir: path.join(process.cwd(), 'logs'),
  maxSize: 1024 * 1024 * 5
});