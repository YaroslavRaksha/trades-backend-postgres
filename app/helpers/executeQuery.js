const pg = require('pg');
const { Pool } = pg;

// postgres://default:T4LqQDYka2Hf@ep-jolly-resonance-114869-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb

// postgresql://postgres:aIGzkEdYmVU15KrSsifq@containers-us-west-37.railway.app:7903/railway
// postgresql://postgres:11cGDGefBcAeC52eB22fF32dafBcBGGA@roundhouse.proxy.rlwy.net:34220/railway

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
