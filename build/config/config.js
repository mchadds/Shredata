"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// to import environment variables
// dotenv will initially try and load the following variables from a dotenv file
// look at documentation for configuration
var dotenv_1 = __importDefault(require("dotenv"));
// loads environment variables
dotenv_1.default.config();
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
// check to see if process.env.SERVER_PORT exists and if it doesn't assign default value
var SERVER_PORT = process.env.SERVER_PORT || 1337;
// define server ande hostname as the constants we defined above
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};
// assign a server key to the SERVER const we created above
var config = {
    server: SERVER
};
// allows access to all the variables defined in the file from other locations (files)
exports.default = config;
