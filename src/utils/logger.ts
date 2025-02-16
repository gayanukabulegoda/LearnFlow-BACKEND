import {createLogger, format, transports} from 'winston';
import {config} from '../config/config';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
/**
 * @description Custom logger configuration with file and console transports
 * @requires winston-daily-rotate-file - Winston transport for daily log rotation
 * @requires path - Node.js path module
 * @exports logger - Winston logger instance for logging
 */
const {combine, timestamp, printf, colorize} = format;

// Custom log format
const logFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} [${level}]: ${message}`;
});

// File transport configuration
const fileTransport = new DailyRotateFile({
    filename: path.join('logs', 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.json()
    )
});

// Console transport configuration
const consoleTransport = new transports.Console({
    format: combine(
        colorize(),
        timestamp({format: 'HH:mm:ss'}),
        logFormat
    )
});

// Create logger instance
const logger = createLogger({
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
        config.NODE_ENV === 'production' ? fileTransport : consoleTransport
    ],
    exceptionHandlers: [
        new transports.File({filename: 'logs/exceptions.log'})
    ],
    rejectionHandlers: [
        new transports.File({filename: 'logs/rejections.log'})
    ]
});

export default logger;