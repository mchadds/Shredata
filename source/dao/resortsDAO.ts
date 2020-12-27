import { ObjectId } from 'bson';
import config from '../config/config';
import { MongoClient } from 'mongodb';

let resorts: any;
let shredata: any;

export default class ResortsDAO {
    static async injectDB(conn: MongoClient) {
        if (resorts) {
            return;
        }
        try {
            shredata = conn.db(config.database);
            resorts = await conn.db(config.database).collection('resorts');
        } catch (e) {
            console.error(`Unable to establish collection handles in resortsDAO: ${e}`);
        }
    }

    /**
     * Retrieves the connection pool size, write concern and user roles on the
     * current client.
     * @returns {Promise<ConfigurationResult>} An object with configuration details.
     */
    static async getConfiguration() {
        const roleInfo = await shredata.command({ connectionStatus: 1 });
        const authInfo = roleInfo.authInfo.authenticatedUserRoles[0];
        const { poolSize, wtimeout } = shredata.s.db.serverConfig.s.options;
        let response = {
            poolSize,
            wtimeout,
            authInfo
        };
        return response;
    }

    /**
     * Finds and returns resorts .
     * Returns a list of objects (resorts).
     * @param {Object} filters - The search parameters to use in the query.
     * @param {number} page - The page of resorts to retrieve.
     * @param {number} resortsPerPage - The number of resorts to display per page.
     * @returns {GetResortsResult} An object with movie results and total results
     * that would match this query
     */
    static async getResorts({
        // here's where the default parameters are set for the getResorts method
        //filters = null,
        //page = 0,
        //resortsPerPage = 20
    } = {}) {
        let queryParams: any = {};
        // if (filters) {
        //     if ('text' in filters) {
        //         queryParams = this.textSearchQuery(filters['text']);
        //     } else if ('cast' in filters) {
        //         queryParams = this.castSearchQuery(filters['cast']);
        //     } else if ('genre' in filters) {
        //         queryParams = this.genreSearchQuery(filters['genre']);
        //     }
        // }

        let { query = {}, project = {} } = queryParams;
        let cursor;
        try {
            //cursor = await resorts.get();
            cursor = await resorts.find(query).project(project);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { resortsList: <any>[], totalNumResorts: 0 };
        }
        try {
            const resortsList = await cursor.toArray();
            const totalNumResorts = await resorts.countDocuments(query);

            return { resortsList, totalNumResorts };
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { resortsList: [], totalNumResorts: 0 };
        }
    }

    /**
     * Gets resorts with their most recent snow report
     * @returns {SkiResort | null} Returns either a single movie or nothing
     */
    static async getResortsSnowReport() {
        let cursor;
        try {
            // pipeline used to retrieve each resort with it's most recent snow report
            const pipeline = [
                {
                    $lookup: {
                        from: 'snowreports',
                        localField: 'name',
                        foreignField: 'Resort Name',
                        as: 'snowreport'
                    }
                },
                {
                    $unwind: {
                        path: '$snowreport'
                    }
                },
                {
                    $sort: {
                        'snowreport.updateTime': -1
                    }
                },
                {
                    $group: {
                        _id: '$name',
                        snowreport: {
                            $first: '$snowreport'
                        },
                        province: {
                            $first: '$province'
                        },
                        longitude: {
                            $first: '$longitude'
                        },
                        latitude: {
                            $first: '$latitude'
                        }
                    }
                }
            ];
            cursor = await resorts.aggregate(pipeline);
        } catch (e) {
            if (
                String(e).startsWith('MongoError: E11000 duplicate key error') ||
                String(e).startsWith('Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
            ) {
                return null;
            }
            console.error(`Something went wrong in getResortsSnowReport: ${e}`);
            throw e;
        }
        try {
            const resortsList = await cursor.toArray();
            const totalNumResorts = await resorts.countDocuments();

            return { resortsList, totalNumResorts };
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { resortsList: [], totalNumResorts: 0 };
        }
    }
}

/**
 * Success/Error return object
 * @typedef DAOResponse
 * @property {boolean} [success] - Success
 * @property {string} [error] - Error
 */
