import request from 'supertest';
import makeApp from './app';
import { jest } from '@jest/globals';

const signin = jest.fn();

const app = makeApp({ signin });

describe('POST /signin', () => {
  beforeEach(() => {
    signin.mockReset();
  });

  describe('when passed nothing', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app).post('/signin');

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing email or password', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ email: 'johnsmith@gmail.com' });

      expect(response.statusCode).toBe(400);
    });

    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ password: '123123' });

      expect(response.statusCode).toBe(400);
    });
  });
});
