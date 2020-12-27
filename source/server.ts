// core of the api that will link everything together

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import resortRoutes from './api/routes/resort';
import snowReportRoutes from './api/routes/snowReport';

import { MongoClient } from 'mongodb';
import ResortsDAO from './dao/resortsDAO';
import SnowReportsDAO from './dao/snowReportsDAO';

// NAMESPACE is used to determine where the logs are coming from
const NAMESPACE = 'Server';
// router defines api's behaviour
const app = express();

/** Logging the request*/
// injecting middleware into router
// middleware is a function that allows you to modify the request, read it, or do something
// with the data that is being passed and sent in
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    // accessing response through middleware
    // listens for any time response is finished
    // not req.statusCode that we are returning is the status code chosen to be returned
    // based on the route that the user picks
    res.on('finish', () => {
        logging.info(
            NAMESPACE,
            `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}],
         STATUS - [${req.statusCode}]`
        );
    });

    next();
});

// parse the body of the request by injecting bodyParser
/** Parse the request */
app.use(bodyParser.urlencoded({ extended: false }));
// allows to send json to nested api and using the parsing functionality of bodyParser
app.use(bodyParser.json());

/** Define rules of API
 * What kind of requests can be made (GET, POST, DELETE)
 * What kind of headers are allowed
 * Where the requests can come from
 */
app.use((req, res, next) => {
    // new piece of middleware
    // for now requests can come from anywhere - do not use this setting for a production api
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accpet, Authorization');

    if (req.method == 'OPTIONS') {
        // return a header that displays all the optionas available
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        // returns a response of 200 which means that the method was accepted
        res.status(200).json({});
    }

    next();
});

/** Routes */
// give routes a prefix = '/sample'
app.use('/api/resorts', resortRoutes);
app.use('/api/snowReports', snowReportRoutes);

/** Error Handling */
app.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message
    });
});

/** Connect to Mongo */
// mongoose
//     .connect(config.mongo.url, config.mongo.options)
//     .then((result) => {
//         logging.info(NAMESPACE, 'Connected to mongoDB!');
//     })
//     .catch((error) => {
//         logging.error(NAMESPACE, error.message, error);
//     });

/** Create the server */
// const httpServer = http.createServer(app);
// httpServer.listen(config.server.port, () =>
//     logging.info(
//         NAMESPACE,
//         `Server running on
// ${config.server.hostname}:${config.server.port}`
//     )
// );

export default app;
