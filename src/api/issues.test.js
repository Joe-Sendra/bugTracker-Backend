const request = require('supertest');
const { expect } = require('chai');
require('chai').should();

// eslint-disable-next-line no-unused-vars
const db = require('./../db/connection');
const app = require('./../app');

describe('Issues - POST /api/v1/issues', () => {
  xit('should not accept invalid properties', async () => {
    const response = await request(app)
      .post('/api/v1/issues')
      .expect(200);
  });
  xit('should require project, type, status, priority, and summary', async () => {
    const response = await request(app)
      .post('/api/v1/issues')
      .expect(422);
  });
  xit('should respond with the created issue', async () => {
    const response = await request(app)
      .post('/api/v1/issues')
      .expect(200);
  });
  xit('should save an issue to the database', async () => {
    const response = await request(app)
      .post('/api/v1/issues')
      .expect(200);
  });
});

describe('Issues - GET /api/v1/issues', () => {
  it('should respond with an array', async () => {
    const response = await request(app)
      .get('/api/v1/issues')
      .expect(200);
    expect(response.body).to.be.an('array');
  });
  xit('should respond with 3 issues', async () => {
    const response = await request(app)
      .get('/api/v1/issues')
      .expect(200);
  });
});

describe('Issues - GET /api/v1/issues/:id', () => {
  xit('should respond with an issue object', async () => {
    const response = await request(app)
      .get('/api/v1/issues/12345')
      .expect(200);
    expect(response.body).to.have.property('_id');
    expect(response.body).to.have.property('project');
    expect(response.body).to.have.property('type');
    expect(response.body).to.have.property('status');
    expect(response.body).to.have.property('priority');
    expect(response.body).to.have.property('summary');
    expect(response.body).to.have.property('createdAt');
    expect(response.body).to.have.property('updatedAt');
    expect(response.body).to.have.property('description');
  });
  xit('should respond with 3 issues', async () => {
    const response = await request(app)
      .get('/api/v1/issues')
      .expect(200);
  });
});

describe('Issues - PATCH /api/v1/issues/:id', () => {
  xit('should not allow _id to be updated', async () => {
    const response = await request(app)
      .patch('/api/v1/issues/:id')
      .expect(200);
  });
  xit('should not allow createdAt to be updated', async () => {
    const response = await request(app)
      .patch('/api/v1/issues/:id')
      .expect(200);
  });  xit('should not updatedAt to be updated', async () => {
    const response = await request(app)
      .patch('/api/v1/issues/:id')
      .expect(200);
  });
  xit('should update project', async () => {
    const response = await request(app)
      .patch('/api/v1/issues/:id')
      .expect(200);
  });
  xit('should update status and priority', async () => {
    const response = await request(app)
      .patch('/api/v1/issues/:id')
      .expect(200);
  });
  xit('should respond with the updated issue', async () => {
    const response = await request(app)
      .patch('/api/v1/issues/:id')
      .expect(200);
  });
});

describe('Issues - DELETE /api/v1/issues/:id', () => {
  xit('should delete an issue', async () => {
    const response = await request(app)
      .get('/api/v1/issues/:id')
      .expect(200);
  });
  xit('should respond with a message', async () => {
    const response = await request(app)
      .get('/api/v1/issues/:id')
      .expect(200);
  });
});
