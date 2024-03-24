import * as winston from 'winston';
// import 'winston-daily-rotate-file';
// import * as SlackHook from 'winston-slack-webhook-transport';
// import * as winstonMongoDB from 'winston-mongodb';

// Create transports instance
const transports = [];

// Create and export the logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});
