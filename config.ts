import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');

const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `[${timestamp}] [DEV-TOOLKIT-91] ${level.toUpperCase()}: ${message}`)
);

export const logger: Logger = createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new transports.Console(),
    new (transports as any).DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'game-engine-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});