const winston = require("winston");
require("winston-daily-rotate-file");
const jsonStringify = require('fast-safe-stringify');

const { createLogger, format, transports } = winston;
const { combine, printf } = format;

/**
 * Allows logging with many string parameters
 * Example:
 *  Logger.debug ('debug 1', 'debug 2', ['debug 3'], {key: 'value'})
 *  Logger.info ('info 1', 'info 2', 'info 3', ['info 3'], {key: 'value'})
 *  Logger.error ('error 1', 'error 2', 'error 3', ['error 3'], {key: 'value'})
 */
const logPrettyFormat = printf((info) => {
  const { timestamp, level, message } = info;
  const args = info[Symbol.for('splat')];
  const outMessage = args ? [message, args.map(jsonStringify).join(' ')].join(' ')  : message;

  return `${timestamp} ${level}: ${outMessage}`;
});

const Logger = createLogger({
  format: combine(
      format.timestamp({
        format: () => {
          return new Date().toLocaleString(APP_SETTINGS.LOCALE_CODE, {
            timeZone: APP_SETTINGS.TIMEZONE
          });
        }
      }),
      logPrettyFormat,
  ),
  transports: [
    new transports.DailyRotateFile({
      level: APP_SETTINGS.LOG_LEVEL,
      filename: __ROOT + "/logs/app-%DATE%.log",
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      handleExceptions: true,
      json: false,
      colorize: false,
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      level: 'error',
      filename: __ROOT + "/logs/error-%DATE%.log",
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '9m',
      maxFiles: '30d',
      handleExceptions: true,
      json: false,
      colorize: false,
    }),
  ],
  exitOnError: false,
});

module.exports = Logger;
