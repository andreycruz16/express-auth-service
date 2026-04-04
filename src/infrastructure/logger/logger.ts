import pino from "pino";

const loggerOptions =
  process.env.NODE_ENV !== "production"
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : {};

export const logger = pino(loggerOptions);
