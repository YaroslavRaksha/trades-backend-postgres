const executeQuery = require('../helpers/executeQuery');
const getError = require("../helpers/getError");

const table = 'morning_existence';

const createMorningExistenceModel = async ({ exchangerId, date, data }) => {
    const values = data.map(({ currency, amount }) => [exchangerId, date, currency, amount]);
    const query = `INSERT INTO ${table} (exchanger_id, date, currency, amount) VALUES ${values.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}`;
    const params = values.flat();

    await executeQuery(query, params);
};

const deleteCurrencyFromMorningExistence = async ({ exchangerId, currencies }) => {
    const query = `DELETE FROM ${table} WHERE exchanger_id = $1 AND currency IN ($2:csv)`;
    const params = [exchangerId, currencies];

    await executeQuery(query, params);
};

const getMorningExistenceModel = async ({ exchangerId, date }) => await executeQuery(
    `SELECT currency, amount FROM ${table} WHERE exchanger_id = $1 AND date = $2`,
    [exchangerId, date]
);

const getPreviousMorningExistenceModel = async ({ exchangerId, date }) => await executeQuery(
    `SELECT currency, amount FROM ${table}
    WHERE exchanger_id = $1 AND date < $2 
    AND date = (SELECT MAX(date) FROM ${table} WHERE date < $3 AND exchanger_id = $4)`,
    [exchangerId, date, date, exchangerId]
);

const putMorningExistenceModel = async ({ exchangerId, date, currency, amount }) => {

    const putMorningExistence = await executeQuery(
        `UPDATE ${table} SET amount = $1 WHERE exchanger_id = $2 AND date = $3 AND currency = $4`,
        [amount, exchangerId, date, currency]
    );

    if(putMorningExistence?.rowCount === 0) {
        throw getError('rest', 400, 'Ошибка при записи наличия на утро.');
    }
};

const deleteMorningExistenceByExchangerIdModel = async ({ exchangerId }) => await executeQuery(
    `DELETE FROM ${table} WHERE exchanger_id = $1`,
    [exchangerId]
);

module.exports = {
    createMorningExistenceModel,
    deleteCurrencyFromMorningExistence,
    putMorningExistenceModel,
    getMorningExistenceModel,
    getPreviousMorningExistenceModel,
    deleteMorningExistenceByExchangerIdModel,
};
