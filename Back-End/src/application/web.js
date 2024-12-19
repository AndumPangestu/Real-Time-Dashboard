import express from 'express';
import { publicRouter } from '../routes/public-route.js';
import logger from '../application/logging.js';
import cors from 'cors';

const web = express();
web.use(cors());
web.use(express.json());
web.use(publicRouter);
export const server = web.listen(5500, () => {
    logger.info("App start");
});


