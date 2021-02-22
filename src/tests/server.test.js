import chai from 'chai';
import http from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../app';
// import model from '../database/models';

const { expect } = chai;

process.env.NODE_ENV = 'test';


chai.use(http);

describe('Server!', () => {
  it('welcomes user to the api', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        // eslint-disable-next-line no-undef
        expect(res).to.have.status(200);
        // eslint-disable-next-line no-undef
        expect(res.body.status).to.equals('success');
        // eslint-disable-next-line no-undef
        expect(res.json.message).to.equals('Welcome to SKY To-Do App!');
        done();
      });
  });
});