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

    /** .
     * Returns all snow reports
     * @param {Object} filters - The search parameters to use in the query.
     * @param {number} page - The page of snow reports to retrieve.
     * @param {number} snowReportsPerPage - The number of snow reports to display per page.
     * @returns {GetSnowReportsResult} An object with snow reports results and total results
     * that would match this query
     */
    static async getSnowReports({
        // here's where the default parameters are set for the getSnowReports method
        // filters = null,
        // page = 0,
        // moviesPerPage = 20
    } = {}) {
        const queryParams: any = {};
        // if (filters) {
        //     if ('text' in filters) {
        //         queryParams = this.textSearchQuery(filters['text']);
        //     } else if ('cast' in filters) {
        //         queryParams = this.castSearchQuery(filters['cast']);
        //     } else if ('genre' in filters) {
        //         queryParams = this.genreSearchQuery(filters['genre']);
        //     }
        // }

        const { query = {}, project = {} } = queryParams;
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
