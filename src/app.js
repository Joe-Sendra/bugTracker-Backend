const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const issues = require('./api/issues');

const app = express();

let dbUrl = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.TEST_DATABASE_URL;
}

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(morgan('common')); // logs requests
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
