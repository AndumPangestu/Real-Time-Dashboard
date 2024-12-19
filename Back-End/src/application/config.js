import dotenv from 'dotenv';

// Memuat file .env
dotenv.config();

// Ekspor variabel environment
//mqtt
export const MQTT_BROKER = process.env.MQTT_BROKER;
export const MQTT_TOPIC = process.env.MQTT_TOPIC;

//redis
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;


//mysql
export const MYSQL_HOST = process.env.MYSQL_HOST;
export const MYSQL_PORT = process.env.MYSQL_PORT;
export const MYSQL_USER = process.env.MYSQL_USER;
export const MYSQL_PASSWORD = process.env.MYSQL;


//websocket
export const WS_PORT = process.env.WS_PORT;