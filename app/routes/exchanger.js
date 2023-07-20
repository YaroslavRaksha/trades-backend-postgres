const validateParams = require("../middleware/validateParams");
const {
    createExchangerController,
    getExchangerByIdController,
    getAllExchangersController,
    updateExchangerByIdController,
    deleteExchangerController,
} = require("../controllers/exchanger");
const validateCurrencies = require("../middleware/validateCurrencies");
const router = require('express').Router();

router.post('/', validateParams([
        { key: 'body', value: 'address' },
        { key: 'body', value: 'currencies' },
    ]),
    validateCurrencies(),
    createExchangerController);

router.get('/all', getAllExchangersController);

router.get('/:id', getExchangerByIdController);

router.put('/:id', validateParams([
        { key: 'body', value: 'date' },
        { key: 'body', value: 'address' },
        { key: 'body', value: 'currencies' },
    ]),
    validateCurrencies(),
    updateExchangerByIdController
);

router.delete('/:id', deleteExchangerController);


module.exports = router;