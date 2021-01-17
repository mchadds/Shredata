import express from 'express';
import controller from '../controllers/resort';

const router = express.Router();

// router.post('/create/resort', controller.createResort);
router.get('/get/resorts', controller.apiGetResorts);
router.get('/get/snowReportsByResort', controller.apiGetResortsAndSnowReport);

export = router;
