const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const app = require('./app');

describe('App - GET /', () => {
  let connection;

  beforeEach((done) => {
    connection = mongoose.createConnection(process.env.TEST_DATABASE_URL);
    connection.once('open', () => {
      done();
    });
  });

  afterEach((done) => {
    connection.close(() => {
      done();
    });
  });

  it('should respond with a message', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Hello World!');
  });
});
