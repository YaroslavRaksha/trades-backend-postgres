const express = require('express');
const getError = require("./helpers/getError");
const app = express();

require('dotenv').config();
app.use(express.json());

app.use('/exchanger', require('./routes/exchanger'));
app.use('/morningExistence', require('./routes/morningExistence'));
app.use('/trades', require('./routes/trades'));

app.all('*', (req, res) =>
    res.status(404).json(getError('rest', 404, 'Not found')));

app.use(require('./middleware/errorHandler'));

module.exports = app;