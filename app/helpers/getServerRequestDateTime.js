const moment = require('moment-timezone');

const getServerRequestDateTime = () => {
    const serverDateTime = moment().tz('Europe/Kiev');
    const date = serverDateTime.format('M/DD/YYYY');
    const time = serverDateTime.format('HH:mm');
    return { date, time };
};

module.exports = getServerRequestDateTime;