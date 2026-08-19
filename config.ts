import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logDirectory = 'logs';

const transport = new DailyRotateFile({
  filename: `${logDirectory}/%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  prepend: true,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;