import { ObjectId } from 'bson';
import config from '../config/config';
import { MongoClient } from 'mongodb';

let snowReports: any;

export default class SnowReportsDAO {
    static async injectDB(conn: MongoClient) {
        if (snowReports) {
            return;
        }
        try {
            snowReports = await conn.db(config.database).collection('snowreports');
        } catch (e) {
            console.error(`Unable to establish collection handles in snowReportsDAO: ${e}`);
        }
    }

    /**
     * Finds and returns movies by country.
     * Returns a list of objects, each object contains a title and an _id.
     * @param {Object} filters - The search parameters to use in the query.
     * @param {number} page - The page of movies to retrieve.
     * @param {number} snowReportsPerPage - The number of movies to display per page.
     * @returns {GetResortsResult} An object with movie results and total results
     * that would match this query
     */
    static async getSnowReports({
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
            cursor = await snowReports.find(query).project(project);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { snowReportsList: <any>[], totalNumSnowReports: 0 };
        }
        try {
            const snowReportsList = await cursor.toArray();
            const totalNumSnowReports = await snowReports.countDocuments(query);

            return { snowReportsList, totalNumSnowReports };
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { snowReportsList: [], totalNumSnowReports: 0 };
        }
    }
}

/**
 * Success/Error return object
 * @typedef DAOResponse
 * @property {boolean} [success] - Success
 * @property {string} [error] - Error
 */
