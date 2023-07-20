const {getMorningExistenceModel} = require("../models/morningExistence");
const getError = require("../helpers/getError");
const checkIfDateIsToday = require("../helpers/checkIfDateIsToday");

const checkPutMorningExistence = () => async (req, res, next) => {
    try {
        const exchangerId = req.params.id;
        const { date } = req.body;

        const alreadyExists = await getMorningExistenceModel({
            exchangerId: exchangerId,
            date: date,
        });

        if(alreadyExists && alreadyExists?.length > 0) {
            const dateIsToday = checkIfDateIsToday(date);

            if(!dateIsToday) {
                throw getError('rest', 400, 'Невозможно выставить наличие для прошедшей даты.')
            }
            else {
                next()
            }
        }

        else {
            throw getError('rest', 400, 'Наличия на утро для данной даты не существует.')
        }

    }
    catch(error) {
        next(error);
    }

}

module.exports = checkPutMorningExistence;