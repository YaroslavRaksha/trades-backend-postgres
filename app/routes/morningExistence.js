const validateParams = require("../middleware/validateParams");
const {
    createMorningExistenceController,
    getMorningExistenceController,
    putMorningExistenceController
} = require("../controllers/morningExistence");
const checkMorningExistence = require("../middleware/checkPutMorningExistence");
const router = require('express').Router();

{/*
router.post('/:id',
    validateParams([
        { key: 'body', value: 'date' },
    ]),
    checkMorningExistence({ throwErrorIfExists: true, }),
    createMorningExistenceController);
*/}

router.get('/:id',
    validateParams([
        { key: 'query', value: 'date' },
    ]),
    getMorningExistenceController);


router.put('/:id',
    validateParams([
        { key: 'body', value: 'date' },
        { key: 'body', value: 'currency' },
        { key: 'body', value: 'amount' },
    ]),
    checkMorningExistence(),
    putMorningExistenceController);

module.exports = router;