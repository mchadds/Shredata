import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Resort from '../../models/resort';
import ResortsDAO from '../../dao/resortsDAO';
//import logging from '../config/logging';

// define namespace for sample controller
//const NAMESPACE = 'Sample Controller';

// const createResort = (req: Request, res: Response, next: NextFunction) => {
//     let { name, province, latitude, longitude } = req.body;

//     const resort = new Resort({
//         _id: new mongoose.Types.ObjectId(),
//         name,
//         province,
//         latitude,
//         longitude
//     });

//     return resort
//         .save()
//         .then((result) => {
//             return res.status(201).json({
//                 resort: result
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

export default class ResortsController {
    static async apiGetResorts(req: Request, res: Response, next: NextFunction) {
        //const MOVIES_PER_PAGE = 20;
        const { resortsList, totalNumResorts } = await ResortsDAO.getResorts();
        let response = {
            resorts: resortsList,
            filters: {},
            total_results: totalNumResorts
        };
        res.json(response);
    }

    static async getConfig(req: Request, res: Response, next: NextFunction) {
        const { poolSize, wtimeout, authInfo } = await ResortsDAO.getConfiguration();
        try {
            let response = {
                pool_size: poolSize,
                wtimeout,
                ...authInfo
            };
            res.json(response);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiGetResortsAndSnowReport(req: Request, res: Response, next: NextFunction) {
        //const MOVIES_PER_PAGE = 20;
        const { resortsList, totalNumResorts } = await ResortsDAO.getResortsSnowReport();
        let response = {
            resorts: resortsList,
            filters: {},
            total_results: totalNumResorts
        };
        res.json(response);
    }
}
