const moment = require('moment-timezone');

const checkIfDateIsToday = (date) => {
    const inputDate = moment(date, 'MM/DD/YYYY').tz('Europe/Kiev').startOf('day');
    const currentDate = moment().tz('Europe/Kiev').startOf('day');

    return inputDate.isSame(currentDate);
};
module.exports = checkIfDateIsToday;