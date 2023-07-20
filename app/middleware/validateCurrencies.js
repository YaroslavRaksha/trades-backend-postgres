
const getError = require("../helpers/getError");

const validateCurrencies = () => {
    return (req, res, next) => {
        const { currencies } = req.body;

        const currenciesArray = currencies.split(',');

        if (currenciesArray.length <= 1) {
            throw getError('rest', 400, `Некорректный ввод валют`)
        }

        if(currenciesArray.some((c) => c.length === 0)) {
            throw getError('rest', 400, `Проверьте запятые между валютами`)
        }

        next();
    };
};

module.exports = validateCurrencies;