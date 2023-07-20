const tryCatch = require("../helpers/tryCatch");
const {
    createMorningExistenceModel,
    putMorningExistenceModel,
    getMorningExistenceModel,
    getPreviousMorningExistenceModel
} = require("../models/morningExistence");
const getError = require("../helpers/getError");
const checkIfDateIsToday = require("../helpers/checkIfDateIsToday");
const {getExchangerByIdModel} = require("../models/exchanger");
const {getPreviousTradesModel} = require("../models/trades");

{/*
const createMorningExistenceController = tryCatch(async (req, res) => {

    const exchangerId = req.params.id;
    const { date } = req.body;

    const data = [
        { currency: '$', amount: '120', },
        { currency: 'euro', amount: '150', }
    ];

    await createMorningExistenceModel({
        exchangerId: exchangerId,
        date: date,
        data: data,
    });

    return res.status(200).json({ ok: true });
});

*/}

const getMorningExistenceController = tryCatch(async (req, res) => {
    const exchangerId = req.params.id;
    const { date } = req.query;

    const morningExistence = await getMorningExistenceModel({
        exchangerId: exchangerId,
        date: date,
    });

    if(morningExistence && morningExistence?.length > 0) {
        return res.status(200).json(morningExistence)
    }
    else {

        const dateIsToday = checkIfDateIsToday(date);

        if(dateIsToday) {

            const exchangerData = await getExchangerByIdModel({ exchangerId: exchangerId });

            const previousMorningExistenceData = await getPreviousMorningExistenceModel({
                exchangerId: exchangerId,
                date: date
            });

            const currencies = exchangerData?.length > 0
                && exchangerData[0].currencies?.replaceAll(' ', '')?.split(',');

            const previousMorningExistence = previousMorningExistenceData?.length > 0
                && previousMorningExistenceData;

            const formattedPreviousMorningExistence = currencies?.map((currency) => ({
                currency: currency,
                amount: (previousMorningExistence && previousMorningExistence?.find((prevMorning) =>
                    prevMorning?.currency === currency)?.amount) || '0'
            }));

            const prevTrades = await getPreviousTradesModel({
                exchangerId: exchangerId,
                date: date,
            });

            const generatedMorningExistence = formattedPreviousMorningExistence?.map(({ currency, amount }) => {

                if(currency === 'uah') {

                    const buySum = prevTrades
                        .filter(trade => trade.type === 'buy')
                        .reduce((sum, trade) => sum + parseFloat(trade.course) * parseFloat(trade.amount), 0);

                    const saleSum = prevTrades
                        .filter(trade => trade.type === 'sale')
                        .reduce((sum, trade) => sum + parseFloat(trade.course) * parseFloat(trade.amount), 0);

                    const buyMinusSaleAmount = buySum - saleSum;

                    return {
                        currency: currency,
                        amount: amount - (buyMinusSaleAmount)
                    }
                }
                else {
                    const buyAmountSum = prevTrades
                        .filter((trade) => trade?.type === 'buy' && trade?.currency === currency)
                        .reduce((sum, trade) => sum + parseFloat(trade?.amount), 0);

                    const saleAmountSum = prevTrades
                        .filter((trade) => trade?.type === 'sale' && trade?.currency === currency)
                        .reduce((sum, trade) => sum + parseFloat(trade?.amount), 0);

                    return {
                        currency: currency,
                        amount: amount - (saleAmountSum - buyAmountSum)
                    }
                }
            });

            await createMorningExistenceModel({
                exchangerId: exchangerId,
                date: date,
                data: generatedMorningExistence
            });


            return res.status(200).json(generatedMorningExistence);
        }

        else {
            throw getError('rest', 404, `Информации для даты ${date} не найдено`)
        }
    }

});

const putMorningExistenceController = tryCatch(async (req, res) => {

    const exchangerId = req.params.id;
    const { date, currency, amount } = req.body;

    await putMorningExistenceModel({
        exchangerId: exchangerId,
        date: date,
        currency: currency?.toLowerCase(),
        amount: amount,
    })

    return res.status(200).json({ ok: true })
})

module.exports = {
    getMorningExistenceController,
    putMorningExistenceController,
}
