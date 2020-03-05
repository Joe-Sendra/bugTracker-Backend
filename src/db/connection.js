const mongoose = require('mongoose');

require('dotenv').config();

let dbUrl = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.TEST_DATABASE_URL;
}

const db = mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = db;
