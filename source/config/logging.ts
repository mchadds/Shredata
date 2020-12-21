// custom logger

// gives current date in nice readable format
const getTimeStamp = (): string => {
    return new Date().toISOString();
};

// optional object parameter is in case we want to pass something in and look at it in its JSON format
// log for info
const info = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
    } else {
        console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
    }
};

// log for warning
const warn = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
    } else {
        console.warn(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
    }
};

// log for errors
const error = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object);
    } else {
        console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
    }
};

// log for debugging
const debug = (namespace: string, message: string, object?: any) => {
    if (object) {
        console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
    } else {
        console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};

export default {
    info,
    warn,
    error,
    debug
};
