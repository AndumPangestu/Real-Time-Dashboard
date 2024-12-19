import mqtt from 'mqtt';
import logger from './logging.js';
import { handleMQTTMessage } from '../controllers/sensor-controller.js';
import { MQTT_BROKER, MQTT_TOPIC } from '../application/config.js';


async function initializeMQTTClient() {

    const client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
        logger.info('Connected to MQTT broker');
        client.subscribe(MQTT_TOPIC, (err) => {
            if (err) {
                logger.error('MQTT subscription error:', err);
            } else {
                logger.info(`Subscribed to topic: ${MQTT_TOPIC}`);
            }
        });
    });

    client.on('message', handleMQTTMessage);

    client.on('error', (error) => {
        logger.error('MQTT client error:', error);
    });
}

export default initializeMQTTClient;