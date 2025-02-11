import { browser } from '$app/environment';
import pino, { type LevelWithSilent, type Logger } from 'pino';
import { get, readable } from 'svelte/store';

export type PinoLogger = Logger & {
    setLogLevel?: (level?: LevelWithSilent) => LevelWithSilent;
};

// Default log level depends on NODE_ENV
const defaultLogLevel: LevelWithSilent = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

const globalPinoLogger: PinoLogger = pino({
    // Prettify the output on the browser or during development
    ...((browser || process.env.NODE_ENV === 'development') && {
        browser: { asObject: false },
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: true
            }
        }
    }),
    level: defaultLogLevel,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        }
    }
});

globalPinoLogger.setLogLevel = (level?: LevelWithSilent) => {
    level = level ?? defaultLogLevel;
    globalPinoLogger.level = level;

    globalPinoLogger.info(`Logger log level is set to '${level}'.`);

    return level;
};

globalPinoLogger.setLogLevel();

const pinoLogger = readable<PinoLogger>(globalPinoLogger);

// Global logger object
export const logger = get(pinoLogger);
