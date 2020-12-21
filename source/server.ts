// core of the api that will link everything together

import http from 'http';
import express from 'express';
import bodyParser, { json } from 'body-parser';
import logging from './config/logging';
import config from './config/config';

// NAMESPACE is used to determine where the logs are coming from
const NAMESPACE = 'Server';
// router defines api's behaviour
const router = express();

/** Logging the request*/
// injecting middleware into router
// middleware is a function that allows you to modify the request, read it, or do something
// with the data that is being passed and sent in
router.use((req, res, next) => {
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
});

// parse the body of the request by injecting bodyParser
/** Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
// allows to send json to nested api and using the parsing functionality of bodyParser
router.use(bodyParser.json());

/** Define rules of API
 * What kind of requests can be made (GET, POST, DELETE)
 * What kind of headers are allowed
 * Where the requests can come from
 */
router.use((req, res, next) => {
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
});

/** Routes */

/** Error Handling */
router.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(404).json({
        message: error.message
    });
});

/** Create the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () =>
    logging.info(
        NAMESPACE,
        `Server running on
${config.server.hostname}:${config.server.port}`
    )
);
