import express from 'express';
import controller from '../controllers/snowReport';

const router = express.Router();

//router.post('/create/snowReport', controller.createSnowReport);
router.get('/get/snowReports', controller.apiGetSnowReports);

export = router;
