import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = './logs';
const MAX_SIZE = 1024 * 1024 * 5;

export const gamingLogger = (message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') => {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
  const logPath = path.join(LOG_DIR, 'game-engine.log');
  
  if (fs.existsSync(logPath)) {
    const stats = fs.statSync(logPath);
    if (stats.size > MAX_SIZE) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      fs.renameSync(logPath, path.join(LOG_DIR, `game-engine-${timestamp}.log`));
    }
  }

  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(logPath, entry);
};

export const gameLog = {
  info: (msg: string) => gamingLogger(msg, 'INFO'),
  warn: (msg: string) => gamingLogger(msg, 'WARN'),
  error: (msg: string) => gamingLogger(msg, 'ERROR')
};