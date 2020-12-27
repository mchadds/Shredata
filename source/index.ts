import { MongoClient } from 'mongodb';
import ResortsDAO from './dao/resortsDAO';
import SnowReportsDAO from './dao/snowReportsDAO';
import config from './config/config';

MongoClient.connect(config.mongo.url, { useNewUrlParser: true, poolSize: 50, wtimeout: 2500, useUnifiedTopology: true })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async (client) => {
        await ResortsDAO.injectDB(client);
        await SnowReportsDAO.injectDB(client);

        app.listen(config.server.port, () => {
            console.log(`listening on port ${config.server.port}`);
        });
    });
