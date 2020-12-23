import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Resort from '../../models/resort';
//import logging from '../config/logging';

// define namespace for sample controller
//const NAMESPACE = 'Sample Controller';

const createResort = (req: Request, res: Response, next: NextFunction) => {
    let { name, province, latitude, longitude } = req.body;

    const resort = new Resort({
        _id: new mongoose.Types.ObjectId(),
        name,
        province,
        latitude,
        longitude
    });

    return resort
        .save()
        .then((result) => {
            return res.status(201).json({
                resort: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllResorts = (req: Request, res: Response, next: NextFunction) => {
    Resort.find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                resorts: results,
                count: results.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { createResort, getAllResorts };
