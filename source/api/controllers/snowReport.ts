import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SnowReport from '../../models/snowReport';
import SnowReportsDAO from '../../dao/snowReportsDAO';
//import Resort from '../models/resort';
//import logging from '../config/logging';

// define namespace for sample controller
//const NAMESPACE = 'Sample Controller';

// const getAllSnowReports = (req: Request, res: Response, next: NextFunction) => {
//     SnowReport.find()
//         .exec()
//         .then((results) => {
//             return res.status(200).json({
//                 resorts: results,
//                 count: results.length
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

// const getSnowReport = (req: Request, res: Response, next: NextFunction) => {
//     SnowReport.find()
//         .exec()
//         .then((results) => {
//             return res.status(200).json({
//                 resorts: results,
//                 count: results.length
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

// export default { createSnowReport, getAllSnowReports };

export default class SnowReportsController {
    static async apiGetSnowReports(req: Request, res: Response, next: NextFunction) {
        //const MOVIES_PER_PAGE = 20;
        const { snowReportsList, totalNumSnowReports } = await SnowReportsDAO.getSnowReports();
        let response = {
            snowReports: snowReportsList,
            filters: {},
            total_results: totalNumSnowReports
        };
        res.json(response);
    }
}
