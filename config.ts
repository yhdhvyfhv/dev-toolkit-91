import * as fs from 'fs';
import * as path from 'path';

interface LoggerConfig {
  logDir: string;
  maxSize: number;
  maxFiles: number;
}

export const loggerConfig: LoggerConfig = {
  logDir: path.join(__dirname, '../logs'),
  maxSize: 5 * 1024 * 1024,
  maxFiles: 5
};

export const rotateLogs = (fileName: string): void => {
  const filePath = path.join(loggerConfig.logDir, fileName);
  if (!fs.existsSync(loggerConfig.logDir)) fs.mkdirSync(loggerConfig.logDir);

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > loggerConfig.maxSize) {
    for (let i = loggerConfig.maxFiles - 1; i > 0; i--) {
      const oldFile = `${filePath}.${i}`;
      const newFile = `${filePath}.${i + 1}`;
      if (fs.existsSync(oldFile)) fs.renameSync(oldFile, newFile);
    }
    fs.renameSync(filePath, `${filePath}.1`);
  }
};

export const logEntry = (message: string): void => {
  rotateLogs('game-engine.log');
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(path.join(loggerConfig.logDir, 'game-engine.log'), entry);
};