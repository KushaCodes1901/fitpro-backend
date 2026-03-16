const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
