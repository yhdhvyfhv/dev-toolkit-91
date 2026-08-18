import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const transport = new winston.transports.File({
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [transport],
});

export const log = (level: string, message: string) => {
    logger.log({ level, message });
};

export const info = (message: string) => log('info', message);
export const error = (message: string) => log('error', message);
export const warn = (message: string) => log('warn', message);
export const debug = (message: string) => log('debug', message);