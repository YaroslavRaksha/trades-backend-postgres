const tryCatch = require("../helpers/tryCatch");
const getServerRequestDateTime = require("../helpers/getServerRequestDateTime");
const {createTradeModel, getTradesModel, updateTradeByIdModel, deleteTradeByIdModel} = require("../models/trades");
const {getExchangerByIdModel} = require("../models/exchanger");
const getError = require("../helpers/getError");


const checkExchangerIdAndCurrency = async ({ exchangerId, currency }) => {
    const exchangerData = await getExchangerByIdModel({
        exchangerId: exchangerId,
    });

    if(!exchangerData || !(exchangerData?.length > 0)) {
        throw getError('rest', 404, 'Обменник с таким идентификатором не найден.')
    }

    const currencies = exchangerData?.length > 0
        && exchangerData[0].currencies?.replaceAll(' ', '')?.split(',');

    if(!(currencies.includes(currency))) {
        throw getError('rest', 404, 'Валюта была удалена или не найдена.')
    }

};

const createTradeController = tryCatch(async (req, res) => {
    const { exchangerId, type, currency, course, amount } = req.body;

    await checkExchangerIdAndCurrency({
        exchangerId: exchangerId,
        currency: currency,
    });

    const { date, time } = getServerRequestDateTime();

    const insertId = await createTradeModel({
        exchangerId: exchangerId,
        date: date,
        time: time,
        type: type,
        currency: currency,
        course: course,
        amount: amount,
    });


    return res.status(200).json({ ok: true, time: time, id: insertId, })
});

const getTradesController = tryCatch(async (req, res) => {
    const { exchangerId, date } = req.query;

    const trades = await getTradesModel({
        exchangerId: exchangerId,
        date: date,
    });

    return res.status(200).json(trades);
});

const updateTradeByIdController = tryCatch(async (req, res) => {

    const { id } = req.params;
    const { key, value } = req.body;

    if(key === 'amount' || key === 'course') {

        await updateTradeByIdModel({
            tradeId: id,
            key: key,
            value: value,
        });

        return res.status(200).json({ ok: true })
    }

    throw getError('rest', 400, 'Некорректное тело запроса.')
});

const deleteTradeByIdController = tryCatch(async (req, res) => {
    const { id } = req.params;

    const { affectedRows } = await deleteTradeByIdModel({
        tradeId: id,
    });

    if(affectedRows === 0) {
        throw getError('rest', 400, 'Такой сделки не существует.')
    }

    return res.status(200).json({ ok: true })
})

module.exports = {
    createTradeController,
    getTradesController,
    updateTradeByIdController,
    deleteTradeByIdController,
}
