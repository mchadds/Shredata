// to import environment variables
// dotenv will initially try and load the following variables from a dotenv file
// look at documentation for configuration
import dotenv from 'dotenv';

// loads environment variables
dotenv.config();

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
    server: SERVER
};

// allows access to all the variables defined in the file from other locations (files)
export default config;
