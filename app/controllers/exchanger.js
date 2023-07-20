const tryCatch = require("../helpers/tryCatch");
const getError = require("../helpers/getError");

const {
    createExchangerModel,
    getExchangerByIdModel,
    getAllExchangersModel,
    updateExchangerByIdModel,
    deleteExchangerModel,
} = require("../models/exchanger");

const {
    getMorningExistenceModel,
    createMorningExistenceModel,
    deleteCurrencyFromMorningExistence,
    deleteMorningExistenceByExchangerIdModel,
} = require("../models/morningExistence");

const {
    deleteTradesByCurrencyModel,
    deleteTradesByExchangerIdModel
} = require("../models/trades");

const createExchangerController = tryCatch(async (req, res) => {
    const { address, currencies } = req.body;

    const currenciesString = [...currencies?.replaceAll(' ', '')?.split(','), 'uah']?.join()?.toLowerCase();

    const insertId = await createExchangerModel({
        address: address,
        currencies: currenciesString
    });

    return res.status(200).json({ ok: true, id: insertId })
});

const getExchangerByIdController = tryCatch(async (req, res) => {
    const exchangerId = req.params.id;

    const exchangerData = await getExchangerByIdModel({
        exchangerId: exchangerId,
    });

    if(exchangerData && exchangerData?.length > 0) {
        return res.status(200).json(exchangerData[0])
    }

    else {
        throw getError('rest', 404, 'Данные для данного обменника не найдены')
    }

})

const getAllExchangersController = tryCatch(async (req, res) => {
    const allExchangers = await getAllExchangersModel();
    return res.status(200).json(allExchangers);
});

const updateExchangerByIdController = tryCatch(async (req, res) => {
    const { id } = req.params;
    const { date, address, currencies } = req.body;

    const currenciesArray = [...currencies?.replaceAll(' ', '')?.toLowerCase()?.split(','), 'uah'];

    const { affectedRows } = await updateExchangerByIdModel({
        exchangerId: id,
        address: address,
        currencies: currenciesArray?.join()?.toLowerCase(),
    });

    const morningData = await getMorningExistenceModel({
        exchangerId: id,
        date: date,
    });

    if(affectedRows === 0) {
        throw getError('rest', 404, 'Обменник не был найден для изменения настроек.')
    }

    const toAdd = currenciesArray?.filter((currency) => !morningData.find((i) => i.currency === currency));
    const toDelete = morningData?.filter((item) => !currenciesArray?.find((currency) => currency === item.currency))?.map((i) => i.currency);

    if(toAdd?.length > 0) {
        await createMorningExistenceModel({
            exchangerId: id,
            date: date,
            data: toAdd.map((currency) => ({ currency: currency, amount: 0 }))
        })
    }

    if(toDelete?.length > 0) {
        await deleteCurrencyFromMorningExistence({
            exchangerId: id,
            currencies: toDelete
        });

        await deleteTradesByCurrencyModel({
            exchangerId: id,
            currencies: toDelete
        })
    }

    return res.status(200).json({ ok: true })
})

const deleteExchangerController = tryCatch(async (req, res) => {
    const exchangerId = req.params.id;

    await deleteMorningExistenceByExchangerIdModel({
        exchangerId: exchangerId,
    });

    await deleteTradesByExchangerIdModel({
        exchangerId: exchangerId,
    })

    await deleteExchangerModel({
        exchangerId: exchangerId,
    });

    return res.status(200).json({ ok: true });
});



module.exports = {
    createExchangerController,
    getExchangerByIdController,
    getAllExchangersController,
    updateExchangerByIdController,
    deleteExchangerController,
}
