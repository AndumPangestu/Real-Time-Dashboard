import logger from '../application/logging.js';
import validate from '../validations/validation.js';
import { createSensorDataValidator } from '../validations/sensor-validation.js';
import { prismaClient } from '../application/database.js';
import { redisServer } from '../application/redis.js';


const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 100; // Default ke 100ms jika tidak diatur

async function processSensorData() {
    logger.info('Sensor data processor started...');

    while (true) {
        try {

            if (!redisServer.isOpen) {
                logger.warn('Redis client not connected. Waiting to reconnect...');
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Tunggu 1 detik
                continue;
            }


            const data = await redisServer.lPop('sensor_queue');
            if (data) {
                try {
                    const parsedData = JSON.parse(data);
                    logger.debug('Received sensor data:', parsedData);

                    // Validasi data
                    const sensorData = validate(createSensorDataValidator, parsedData);

                    // Data preprocessing
                    const processedData = {
                        timestamp: new Date(sensorData.timestamp),
                        suhu: parseFloat(sensorData.suhu),
                        temperature: parseFloat(sensorData.temperature),
                        status_a: Boolean(sensorData.status_a),
                        status_b: Boolean(sensorData.status_b),
                    };


                    await Promise.all([

                        await redisServer.publish('sensor_data', data),
                        saveToDatabase(processedData)
                    ]);





                } catch (validationOrDbError) {
                    logger.error('Error processing sensor data:' + validationOrDbError.message);
                }
            } else {
                logger.debug('No data in sensor_queue. Sleeping...');
                await new Promise((resolve) => setTimeout(resolve, SLEEP_INTERVAL)); // Prevent busy loop
            }

        } catch (redisError) {
            logger.error('Error accessing Redis queue:', redisError.message);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay jika ada masalah dengan Redis
        }
    }
}


async function saveToDatabase(data) {
    try {
        await prismaClient.sensorData.create({ data });
        logger.info('Data saved to database successfully');
    } catch (error) {
        logger.error('Error saving data to database:', error.message);
        throw error; // Pastikan error ini dicatat untuk debugging
    }
}

async function getDataSensor() {

    const data = await prismaClient.sensorData.findMany({
        orderBy: {
            timestamp: 'asc'
        }
    });

    return data

}


async function exportExcelProcess() {

    try {
        data = await prismaClient.sensorData.findMany();
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
    } catch (error) {
        console.error('Error exporting sensor data:', error);
        res.status(500).json({ error: 'Failed to export sensor data' });
    }
}


export { processSensorData, getDataSensor, exportExcelProcess };
