import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = './logs';
const MAX_SIZE = 1024 * 1024 * 5;

export const logger = (message: string, level: 'INFO' | 'WARN' | 'ERR' = 'INFO') => {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
  const logPath = path.join(LOG_DIR, 'game-engine.log');
  
  if (fs.existsSync(logPath) && fs.statSync(logPath).size > MAX_SIZE) {
    const timestamp = Date.now();
    fs.renameSync(logPath, path.join(LOG_DIR, `game-engine-${timestamp}.log`));
  }

  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(logPath, entry);
};

export const getLogStats = () => {
  const logPath = path.join(LOG_DIR, 'game-engine.log');
  try {
    return fs.statSync(logPath).size;
  } catch {
    return 0;
  }
};