import { createClient } from 'redis'; // Import sesuai modul redis
import logger from './logging.js';
import { REDIS_HOST, REDIS_PORT } from './config.js';


const redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
const redisServer = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });


const connectRedis = async () => {
    try {
        await redisClient.connect();
        await redisServer.connect();
        logger.info('Connected to Redis');
    } catch (error) {
        logger.error('Error connecting to Redis:', error);
    }
};

redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
});

redisClient.on('ready', () => {
    logger.info('Redis client is ready');
});

redisServer.on('ready', () => {
    logger.info('Redis Server is ready');
});

redisServer.on('error', (err) => {
    logger.error('Redis Server Error:', err);
});




await connectRedis();

export { redisClient, redisServer };
