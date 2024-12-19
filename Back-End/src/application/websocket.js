import { WebSocketServer } from 'ws';
import { WS_PORT } from './config.js';
import { redisClient } from './redis.js';
import logger from './logging.js';
import { server } from './web.js';

const wss = new WebSocketServer({ server });
logger.info(`WebSocket Server running on port ${WS_PORT}`);

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

(async () => {
    try {
        await redisClient.subscribe('sensor_data', (message) => {
            logger.info(`Pesan diterima dari Redis: ${message}`);
            broadcast(JSON.parse(message));
        });
        logger.info('Subscribed to Redis channel: sensor_queue');
    } catch (error) {
        logger.error('Failed to subscribe to Redis channel:', error);
    }
})();


export { wss };