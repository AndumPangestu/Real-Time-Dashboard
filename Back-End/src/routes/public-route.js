import express from 'express';
import { get, exportExcel } from '../controllers/sensor-controller.js';

export const web = express();


const publicRouter = new express.Router();
publicRouter.get('/api/sensors', get);
publicRouter.get('/api/sensors/export', exportExcel);


export { publicRouter };