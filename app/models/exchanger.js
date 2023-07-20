const executeQuery = require('../helpers/executeQuery');

const table = 'exchangers';

const createExchangerModel = async ({ address, currencies }) => {
    const query = `INSERT INTO ${table} (address, currencies) VALUES ($1, $2) RETURNING id`;
    const params = [address, currencies];
    const result = await executeQuery(query, params);
    return result[0].id;
};

const getExchangerByIdModel = async ({ exchangerId }) => await executeQuery(
    `SELECT address, currencies FROM ${table} WHERE id = $1`,
    [exchangerId]
);

const updateExchangerByIdModel = async ({ exchangerId, address, currencies }) => await executeQuery(
    `UPDATE ${table} SET address = $1, currencies = $2 WHERE id = $3`,
    [address, currencies, exchangerId]
);

const getAllExchangersModel = async () => await executeQuery(
    `SELECT * FROM ${table}`
);

const deleteExchangerModel = async ({ exchangerId }) => await executeQuery(
    `DELETE FROM ${table} WHERE id = $1`,
    [exchangerId]
);

module.exports = {
    createExchangerModel,
    getExchangerByIdModel,
    getAllExchangersModel,
    updateExchangerByIdModel,
    deleteExchangerModel,
};
