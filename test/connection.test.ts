import ResortsDAO from '../source/dao/resortsDAO';
import config from '../source/config/config';
import { MongoClient } from 'mongodb';
import { Mongoose } from 'mongoose';

let conn: any;

describe('Connection', () => {
    beforeAll(async () => {
        await ResortsDAO.injectDB(conn);
    });

    test('Can access MFlix data', async () => {
        const shredata = conn.db('Shredata');
        const collections = await shredata.listCollections().toArray();
        const collectionNames = collections.map((elem: any) => elem.name);
        expect(collectionNames).toContain('resorts');
        expect(collectionNames).toContain('snowreports');
    });

    // test('Can retrieve a movie by id', async () => {
    //     const id = '573a13a6f29313caabd17bd5';
    //     const movie = await ResortsDAO.getMovieByID(id);
    //     expect(movie.title).toEqual('Once Upon a Time in Mexico');
    // });

    // test('Can retrieve first page of movies', async () => {
    //     const { moviesList: firstPage, totalNumMovies: numMovies } = await MoviesDAO.getMovies();
    //     expect(firstPage.length).toEqual(20);
    //     expect(numMovies).toEqual(23530);
    // });
});
