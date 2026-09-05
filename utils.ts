import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = './logs';
const MAX_SIZE = 5 * 1024 * 1024;

export const logger = (message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') => {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
  const logPath = path.join(LOG_DIR, 'game.log');
  
  if (fs.existsSync(logPath) && fs.statSync(logPath).size > MAX_SIZE) {
    const timestamp = Date.now();
    fs.renameSync(logPath, path.join(LOG_DIR, `game.${timestamp}.log`));
  }

  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(logPath, entry);
  process.stdout.write(entry);
};

export const gameLogger = {
  info: (msg: string) => logger(msg, 'INFO'),
  warn: (msg: string) => logger(msg, 'WARN'),
  error: (msg: string) => logger(msg, 'ERROR')
};