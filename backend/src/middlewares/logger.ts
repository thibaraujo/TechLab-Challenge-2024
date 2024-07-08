import winston from "winston";
import expressWinston from 'express-winston'

export const logger = expressWinston.logger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),

    process.env.NODE_ENV !== 'production' ? new winston.transports.Console({
      format: winston.format.simple(),
    }) : null,
  ].filter(i => i !== null),
});

