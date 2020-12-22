"use strict";
// core of the api that will link everything together
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
var sample_1 = __importDefault(require("./routes/sample"));
// NAMESPACE is used to determine where the logs are coming from
var NAMESPACE = 'Server';
// router defines api's behaviour
var router = express_1.default();
/** Logging the request*/
// injecting middleware into router
// middleware is a function that allows you to modify the request, read it, or do something
// with the data that is being passed and sent in
router.use(function (req, res, next) {
    logging_1.default.info(NAMESPACE, "METHOD - [" + req.method + "], URL - [" + req.url + "], IP - [" + req.socket.remoteAddress + "]");
    // accessing response through middleware
    // listens for any time response is finished
    // not req.statusCode that we are returning is the status code chosen to be returned
    // based on the route that the user picks
    res.on('finish', function () {
        logging_1.default.info(NAMESPACE, "METHOD - [" + req.method + "], URL - [" + req.url + "], IP - [" + req.socket.remoteAddress + "],\n         STATUS - [" + req.statusCode + "]");
    });
    next();
});
// parse the body of the request by injecting bodyParser
/** Parse the request */
router.use(body_parser_1.default.urlencoded({ extended: false }));
// allows to send json to nested api and using the parsing functionality of bodyParser
router.use(body_parser_1.default.json());
/** Define rules of API
 * What kind of requests can be made (GET, POST, DELETE)
 * What kind of headers are allowed
 * Where the requests can come from
 */
router.use(function (req, res, next) {
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
router.use('/sample', sample_1.default);
/** Error Handling */
router.use(function (req, res, next) {
    var error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
/** Create the server */
var httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, function () {
    return logging_1.default.info(NAMESPACE, "Server running on\n" + config_1.default.server.hostname + ":" + config_1.default.server.port);
});
