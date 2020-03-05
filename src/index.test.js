const request = require('supertest');
const { expect } = require('chai');

// eslint-disable-next-line no-unused-vars
const db = require('./db/connection');
const app = require('./app');

describe('App - GET /', () => {
  it('should respond with a message', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Hello World!');
  });
});
