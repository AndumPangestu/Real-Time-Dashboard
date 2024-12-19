import logger from "./application/logging.js";
import { wss } from './application/websocket.js';
import initializeMQTTClient from './application/mqtt-client.js';
import { processSensorData } from './services/sensor-service.js';


async function startServer() {
    try {
        await initializeMQTTClient();
        await processSensorData();

        wss.on('listening', () => {
            logger.log(`WebSocket Server running on port ${wss.options.port}`);
        });



    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();