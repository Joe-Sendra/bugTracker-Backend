const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const middlewares = require('./middlewares');
const issues = require('./issues/issues.routes');

require('dotenv').config();

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('common')); // logs requests
}
app.use(helmet()); // blocks some headers and adds others
app.use(cors({
  origin: process.env.CORS_ORIGIN,
})); // needed to allow other sites to use server
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/api/v1/issues', issues);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
