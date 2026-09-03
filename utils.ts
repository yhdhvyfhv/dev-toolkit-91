import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = './logs';
const MAX_SIZE = 1024 * 1024 * 5;

export const gamingLogger = (message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO') => {
  const logFile = path.join(LOG_DIR, 'gameplay.log');
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

  try {
    const stats = fs.statSync(logFile);
    if (stats.size > MAX_SIZE) {
      const timestamp = Date.now();
      fs.renameSync(logFile, `${logFile}.${timestamp}.bak`);
    }
  } catch (e) {}

  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
};

export const rotateLogs = () => {
  fs.readdirSync(LOG_DIR).forEach(file => {
    if (file.endsWith('.bak')) {
      const filePath = path.join(LOG_DIR, file);
      const age = Date.now() - fs.statSync(filePath).mtimeMs;
      if (age > 86400000 * 7) fs.unlinkSync(filePath);
    }
  });
};

export type Logger = typeof gamingLogger;