const executeQuery = require('../helpers/executeQuery');

const table = 'trades';

const createTradeModel = async ({ exchangerId, date, time, type, currency, course, amount }) => {
    const query = `INSERT INTO ${table} (exchanger_id, date, time, type, currency, course, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const params = [exchangerId, date, time, type, currency, course, amount];
    const result = await executeQuery(query, params);
    return result[0].id;
};

const getTradesModel= async ({ exchangerId, date }) => await executeQuery(
    `SELECT id, type, time, currency, course, amount FROM ${table} WHERE exchanger_id = $1 AND date = $2`,
    [exchangerId, date]
)

const updateTradeByIdModel = async ({ tradeId, key, value }) => await executeQuery(
    `UPDATE ${table} SET ${key} = $1 WHERE id = $2`,
    [value, tradeId]
);

const deleteTradeByIdModel = async ({ tradeId }) => await executeQuery(
    `DELETE FROM ${table} WHERE id = $1`,
    [tradeId]
);

const deleteTradesByCurrencyModel = async ({ exchangerId, currencies }) => {
    await executeQuery(
        `DELETE FROM ${table} WHERE currency = ANY($1) AND exchanger_id = $2`,
        [currencies, exchangerId]
    );
};

const getPreviousTradesModel = async ({ exchangerId, date }) => await executeQuery(
    `SELECT type, course, currency, amount FROM ${table}
    WHERE exchanger_id = $1 AND date = (
        SELECT MAX(date) FROM ${table} WHERE exchanger_id = $2 AND date < $3
    )`,
    [exchangerId, exchangerId, date]
);

const deleteTradesByExchangerIdModel = async ({ exchangerId }) => await executeQuery(
    `DELETE FROM ${table} WHERE exchanger_id = $1`,
    [exchangerId]
);

module.exports = {
    createTradeModel,
    getTradesModel,
    updateTradeByIdModel,
    deleteTradeByIdModel,
    deleteTradesByCurrencyModel,
    getPreviousTradesModel,
    deleteTradesByExchangerIdModel,
};
