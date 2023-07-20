const getError = require("../helpers/getError");

const validateParams = (params) => {
    return (req, res, next) => {
        const missingParams = params.filter((param) => {
            const { key, value } = param;

            return (
                (key === 'param' && !req.params[value]) ||
                (key === 'query' && !req.query[value]) ||
                (key === 'body' && !req.body[value])
            );
        });

        if (missingParams.length > 0) {
            const missingParamNames = missingParams.map((param) => `${param.value} at ${param.key}`).join(', ');
            throw getError('rest', 400, `Missing parameter(s): ${missingParamNames}`)
        }

        next();
    };
};

module.exports = validateParams;