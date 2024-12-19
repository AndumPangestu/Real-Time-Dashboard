
import { prismaClient } from '../application/database.js';
import logger from '../application/logging.js';
import { redisServer } from '../application/redis.js';
import { getDataSensor, exportExcelProcess } from '../services/sensor-service.js';
import XLSX from 'xlsx';

async function handleMQTTMessage(topic, message) {
    try {
        const data = JSON.parse(message.toString());
        await redisServer.rPush('sensor_queue', JSON.stringify(data));
    } catch (error) {
        logger.error('Error processing MQTT message:', error);
    }
}


async function get(req, res, next) {
    try {
        const result = await getDataSensor();
        res.status(200).json({
            data: result
        });

    } catch (e) {

        return res.status(500).json({
            message: e.message
        });

    }
}


async function exportExcel(req, res, next) {
    try {

        const data = await prismaClient.sensorData.findMany();
        // Membuat workbook dan worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Menulis workbook ke buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Menyediakan file untuk di-download
        res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);


    } catch (e) {

        return res.status(500).json({
            message: e.message
        });

    }
}

export { handleMQTTMessage, get, exportExcel };