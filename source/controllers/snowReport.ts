import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SnowReport from '../models/snowReport';
//import Resort from '../models/resort';
//import logging from '../config/logging';

// define namespace for sample controller
//const NAMESPACE = 'Sample Controller';

const createSnowReport = (req: Request, res: Response, next: NextFunction) => {
    let { resortName, updateTime, values, notes } = req.body;
    const snowReport = new SnowReport({
        _id: new mongoose.Types.ObjectId(),
        resortName,
        updateTime,
        values,
        notes
    });

    return snowReport
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

const getAllSnowReports = (req: Request, res: Response, next: NextFunction) => {
    SnowReport.find()
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

const getSnowReport = (req: Request, res: Response, next: NextFunction) => {
    SnowReport.find()
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

export default { createSnowReport, getAllSnowReports };
