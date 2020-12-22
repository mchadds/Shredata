"use strict";
// custom logger
Object.defineProperty(exports, "__esModule", { value: true });
// gives current date in nice readable format
var getTimeStamp = function () {
    return new Date().toISOString();
};
// optional object parameter is in case we want to pass something in and look at it in its JSON format
// log for info
var info = function (namespace, message, object) {
    if (object) {
        console.info("[" + getTimeStamp() + "] [INFO] [" + namespace + "] " + message, object);
    }
    else {
        console.info("[" + getTimeStamp() + "] [INFO] [" + namespace + "] " + message);
    }
};
// log for warning
var warn = function (namespace, message, object) {
    if (object) {
        console.warn("[" + getTimeStamp() + "] [WARN] [" + namespace + "] " + message, object);
    }
    else {
        console.warn("[" + getTimeStamp() + "] [WARN] [" + namespace + "] " + message);
    }
};
// log for errors
var error = function (namespace, message, object) {
    if (object) {
        console.error("[" + getTimeStamp() + "] [ERROR] [" + namespace + "] " + message, object);
    }
    else {
        console.error("[" + getTimeStamp() + "] [ERROR] [" + namespace + "] " + message);
    }
};
// log for debugging
var debug = function (namespace, message, object) {
    if (object) {
        console.debug("[" + getTimeStamp() + "] [DEBUG] [" + namespace + "] " + message, object);
    }
    else {
        console.debug("[" + getTimeStamp() + "] [DEBUG] [" + namespace + "] " + message);
    }
};
exports.default = {
    info: info,
    warn: warn,
    error: error,
    debug: debug
};
