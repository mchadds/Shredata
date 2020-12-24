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
     * Finds and returns movies by country.
     * Returns a list of objects, each object contains a title and an _id.
     * @param {Object} filters - The search parameters to use in the query.
     * @param {number} page - The page of movies to retrieve.
     * @param {number} resortsPerPage - The number of movies to display per page.
     * @returns {GetResortsResult} An object with movie results and total results
     * that would match this query
     */
    static async getResorts({
        // here's where the default parameters are set for the getMovies method
        //filters = null,
        //page = 0,
        //moviesPerPage = 20
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
     * Gets a movie by its id
     * @param {string} id - The desired movie id, the _id in Mongo
     * @returns {MflixMovie | null} Returns either a single movie or nothing
     */
    static async getResortsSnowReport() {
        let cursor;
        try {
            /**
      Ticket: Get Comments

      Given a movie ID, build an Aggregation Pipeline to retrieve the comments
      matching that movie's ID.

      The $match stage is already completed. You will need to add a $lookup
      stage that searches the `comments` collection for the correct comments.
      */

            // TODO Ticket: Get Comments
            // Implement the required pipeline.
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
            //return await resorts.aggregate(pipeline).next();
        } catch (e) {
            /**
      Ticket: Error Handling

      Handle the error that occurs when an invalid ID is passed to this method.
      When this specific error is thrown, the method should return `null`.
      */
            if (
                String(e).startsWith('MongoError: E11000 duplicate key error') ||
                String(e).startsWith('Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
            ) {
                return null;
            }
            // TODO Ticket: Error Handling
            // Catch the InvalidId error by string matching, and then handle it.
            console.error(`Something went wrong in getMovieByID: ${e}`);
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
