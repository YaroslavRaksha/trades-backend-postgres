const validateParams = require("../middleware/validateParams");
const {
    createTradeController,
    getTradesController,
    updateTradeByIdController,
    deleteTradeByIdController,
} = require("../controllers/trades");
const router = require('express').Router();

router.post('/', validateParams([
        { key: 'body', value: 'exchangerId' },
        { key: 'body', value: 'type' },
        { key: 'body', value: 'currency' },
        { key: 'body', value: 'course' },
        { key: 'body', value: 'amount' },
    ]),
    createTradeController);

router.get('/', validateParams([
        { key: 'query', value: 'exchangerId' },
        { key: 'query', value: 'date' },
    ]),
    getTradesController);

router.put('/:id', validateParams([
        { key: 'body', value: 'key' },
        { key: 'body', value: 'value' },
    ]),
    updateTradeByIdController);

router.delete('/:id', deleteTradeByIdController);


module.exports = router;