import { PrismaClient } from "@prisma/client";
import logger from "./logging.js";

export const prismaClient = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

prismaClient.$on('error', (e) => {
    logger.error("Prisma error: " + e);
});

prismaClient.$on('warn', (e) => {
    logger.warn("Prisma warn: " + e);
});

prismaClient.$on('info', (e) => {
    logger.info("Prisma info: " + e);
});

prismaClient.$on('query', (e) => {
    logger.info("Prisma query: " + e);;
});