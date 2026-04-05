import pino from 'pino';
import { pinoHttp } from 'pino-http';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino(isDev ? { transport: { target: 'pino-pretty' } } : {});
export const httpLogger = pinoHttp({});
