// to import environment variables
// dotenv will initially try and load the following variables from a dotenv file
// look at documentation for configuration
import dotenv from 'dotenv';

// loads environment variables
dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'skier_358';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'h1tTh3Sl0p35';
//mongodb://localhost:27017
// also change to MONGO_URL instead of URI if not working
//const MONGO_HOST = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_HOST = process.env.MONGO_URL || 'clusterskireport.o0o97.mongodb.net/Shredata?retryWrites=true&w=majority';
//const MONGO_HOST = process.env.MONGO_URL || 'clusterskireport-shard-00-00.o0o97.mongodb.net';

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
    //  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@clusterskireport.o0o97.mongodb.net/<dbname>?retryWrites=true&w=majority`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
// check to see if process.env.SERVER_PORT exists and if it doesn't assign default value
const SERVER_PORT = process.env.SERVER_PORT || 1337;

// define server ande hostname as the constants we defined above
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

// assign a server key to the SERVER const we created above
const config = {
    mongo: MONGO,
    server: SERVER
};

// allows access to all the variables defined in the file from other locations (files)
export default config;
