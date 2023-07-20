const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    connectionString: "postgres://default:T4LqQDYka2Hf@ep-jolly-resonance-114869-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb" + "?sslmode=require",
})

const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool
            .connect()
            .then((client) => {
                return client
                    .query(query, params)
                    .then((result) => {
                        client.release();
                        resolve(result.rows);
                    })
                    .catch((err) => {
                        client.release();
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = executeQuery;