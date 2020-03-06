const request = require('supertest');
const { expect } = require('chai');
require('chai').should();

// eslint-disable-next-line no-unused-vars
const db = require('./../db/connection');
const Issue = require('./../models/issueEntry');
const app = require('./../app');

describe('Issues - POST /api/v1/issues', () => {
// Cleans up database between each test
  afterEach(async () => {
    await Issue.deleteMany();
  });
  it('should not accept invalid properties', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({
        badProperty: 'shouldThrowError',
        project: 'fakeProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
      })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Unknown property name: "badProperty"');
      });
  });
  it('should require a project', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({ })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"project" is required');
      });
  });
  it('should require a type', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({ project: 'fakeProject' })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"type" is required');
      });
  });
  it('should require a status', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject',
        type: 'fakeType',
      })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"status" is required');
      });
  });
  it('should require a priority', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject',
        type: 'fakeType',
        status: 'fakeStatus',
      })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"priority" is required');
      });
  });
  it('should require a summary', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
      })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('"summary" is required');
      });
  });
  it('should respond with the created issue', () => {
    return request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('project');
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('priority');
        expect(response.body).to.have.property('summary');
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
        expect(response.body).to.have.property('__v');
      });
  });
  it('should save an issue to the database', async () => {
    return request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProjectTEST',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
      })
      .expect(200)
      .then(async () => {
        const issue = await Issue.findOne({ project: 'fakeProjectTEST' });
        expect(issue.project).to.equal('fakeProjectTEST');
        expect(issue).to.have.property('_id');
      });
  });
});

describe('Issues - GET /api/v1/issues', () => {
  // Cleans up database between each test
  beforeEach(async () => {
    await Issue.deleteMany();
  });
  it('should respond with an array', () => {
    return request(app)
      .get('/api/v1/issues')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.an('array');
      });
  });
  it('should respond with 3 issues', async () => {
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject1',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
      })
      .expect(200);
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject2',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
      })
      .expect(200);
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject3',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
      })
      .expect(200)
      .then(() => {
        return request(app)
          .get('/api/v1/issues')
          .expect(200)
          .then((response) => {
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(3);
          });
      });
  });
});

describe('Issues - GET /api/v1/issues/:id', () => {
  // Cleans up database between each test
  afterEach(async () => {
    await Issue.deleteMany();
  });
  it('should respond with an issue object', async () => {
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary next check by using a GET request with the id',
        description: 'This is for a GET by id test',
      })
      .expect(200);
    const newIssue = await Issue.findOne({ project: 'fakeProject' });
    return request(app)
      .get(`/api/v1/issues/${newIssue.id}`)
      .then((response) => {
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('project');
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('priority');
        expect(response.body).to.have.property('summary');
        expect(response.body).to.have.property('description');
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
        expect(response.body).to.have.property('__v');
      });
  });
  it('should respond with 404 status', async () => {
    await request(app)
      .get('/api/v1/issues/5e61bb6c16f552401c22bf98')
      .expect(404)
      .then((response) => {
        expect(response.body.message).to.equal('Invalid issue ID submitted');
      });
    request(app)
      .get('/api/v1/issues/notAvalidID')
      .expect(404)
      .then((response) => {
        expect(response.body.message).to.equal('Invalid issue ID submitted');
      });
  });
});

describe('Issues - PATCH /api/v1/issues/:id', () => {
  // Cleans up database between each test
  afterEach(async () => {
    await Issue.deleteMany();
  });

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'fakeProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary next test a patch update',
        description: 'This is for testing a patch for id',
      })
      .expect(200);
  });

  it('should not allow _id to be updated', async () => {
    const newIssue = await Issue.findOne({ project: 'fakeProject' });
    return request(app)
      .patch(`/api/v1/issues/${newIssue.id}`)
      .send({ _id: '5e61bb6c16f552401c22bf98' })
      .expect(422)
      .then((response) => {
        expect(response.body.message).to.equal('Can not update issue');
      });
  });
  it('should not allow createdAt to be updated', async () => {    
    const newIssue = await Issue.findOne({ project: 'fakeProject' });
    return request(app)
      .patch(`/api/v1/issues/${newIssue.id}`)
      .send({ createdAt: '' })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Property name "createdAt" can not be manually updated');
      });
  });
  it('should not updatedAt to be updated', async () => {
    const newIssue = await Issue.findOne({ project: 'fakeProject' });
    return request(app)
      .patch(`/api/v1/issues/${newIssue.id}`)
      .send({ updatedAt: '' })
      .expect(422)
      .then((response) => {
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Property name "updatedAt" can not be manually updated');
      });
  });
  it('should update project', async () => {
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'testProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary next test a patch update for project',
        description: 'This is for testing a patch for project',
      })
      .expect(200);
    const newIssue = await Issue.findOne({ project: 'testProject' });
    return request(app)
      .patch(`/api/v1/issues/${newIssue.id}`)
      .send({
        project: 'renamedProject',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.project).to.equal('renamedProject');
      });
  });
  it('should update status and priority', async () => {
    const newIssue = await Issue.findOne({ project: 'fakeProject' });
    return request(app)
      .patch(`/api/v1/issues/${newIssue.id}`)
      .send({
        status: 'in-process',
        priority: 'high',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.status).to.equal('in-process');
        expect(response.body.priority).to.equal('high');
      });
  });
  it('should respond with the updated issue', async () => {
    const newIssue = await Issue.findOne({ project: 'fakeProject' });
    return request(app)
      .patch(`/api/v1/issues/${newIssue.id}`)
      .send({
        type: 'bug',
        status: 'Done',
        summary: 'test new issue received',
      })
      .expect(200)
      .then((response) => {
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('project');
        expect(response.body).to.have.property('type');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('priority');
        expect(response.body).to.have.property('summary');
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
        expect(response.body).to.have.property('__v');
        expect(response.body.type).to.equal('bug');
        expect(response.body.status).to.equal('Done');
        expect(response.body.summary).to.equal('test new issue received');
      });
  });
});

describe('Issues - DELETE /api/v1/issues/:id', () => {
  // Cleans up database between each test
  afterEach(async () => {
    await Issue.deleteMany();
  });
  it('should delete an issue', async () => {
    await request(app)
      .post('/api/v1/issues')
      .send({
        project: 'deleteMeProject',
        type: 'fakeType',
        status: 'fakeStatus',
        priority: 'fakePriority',
        summary: 'fakeSummary',
        description: 'This is for a DELETE by id test',
      })
      .expect(200);
    const newIssue = await Issue.findOne({ project: 'deleteMeProject' });
    const newIssueID = newIssue.id;
    expect(newIssue.project).to.equal('deleteMeProject');
    await request(app)
      .delete(`/api/v1/issues/${newIssue.id}`)
      .expect(204)
      .then((response) => {
        expect(response.body).to.deep.equal({});
      });
    const result = await Issue.findById(newIssueID);
    expect(result).to.be.a('null');
  });
});
