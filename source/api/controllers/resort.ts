import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Resort from '../../models/resort';
import ResortsDAO from '../../dao/resortsDAO';

// controller class for resorts
export default class ResortsController {
    // api call that retrieves all resorts
    static async apiGetResorts(req: Request, res: Response, next: NextFunction) {
        //const RESORTS_PER_PAGE = 20;
        // call ResortsDAO to get resorts
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

    // api call to retrieve all resorts and their most recent snow report
    static async apiGetResortsAndSnowReport(req: Request, res: Response, next: NextFunction) {
        //const RESORTS_PER_PAGE = 20;
        // call ResortsDAO to retrieve resorts and snow report
        const { resortsList, totalNumResorts } = await ResortsDAO.getResortsSnowReport();
        let response = {
            resorts: resortsList,
            filters: {},
            total_results: totalNumResorts
        };
        res.json(response);
    }
}

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