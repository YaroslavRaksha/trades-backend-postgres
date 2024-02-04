const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRE_URL,
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
