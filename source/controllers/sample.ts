import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

// define namespace for sample controller
const NAMESPACE = 'Sample Controller';

//used for logging
const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `Sample health check route called.`);

    return res.status(200).json({
        message: 'pong'
    });
};

export default { sampleHealthCheck };
