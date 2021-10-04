import request from 'supertest';
import makeApp from './app';
import { jest } from '@jest/globals';

const register = jest.fn();
const signin = jest.fn();
const screenshot = jest.fn();

const app = makeApp({ register, signin, screenshot });

describe('POST /register', () => {
  beforeEach(() => {
    register.mockReset();
  });

  describe('when passed nothing', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app).post('/register');

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing name and password', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: 'johnsmith@gmail.com' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing email and password', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/register')
        .send({ name: 'John Smith' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing email and name', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/register')
        .send({ password: '123123' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed valid and complete data', () => {
    test('should get back a status code of 200', async () => {
      const body = {
        email: 'johnsmith1@gmail.com',
        name: 'John Smith',
        password: '123123',
      };

      const response = await request(app).post('/register').send(body);

      expect(register.mock.calls.length).toBe(1);
      expect(register.mock.calls[0][0]).toBe(body.email);
      expect(register.mock.calls[0][1]).toBe(body.name);
      expect(register.mock.calls[0][2]).toBe(body.password);
    });
  });
});

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

  describe('when passed a missing password', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ email: 'johnsmith@gmail.com' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing email', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ password: '123123' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed valid and complete data', () => {
    test('should get back a status code of 200', async () => {
      const body = {
        email: 'johnsmith1@gmail.com',
        password: '123123',
      };

      const response = await request(app).post('/signin').send(body);

      expect(signin.mock.calls.length).toBe(1);
      expect(signin.mock.calls[0][0]).toBe(body.email);
      expect(signin.mock.calls[0][1]).toBe(body.password);
    });
  });
});

describe('POST /screenshot', () => {
  beforeEach(() => {
    screenshot.mockReset();
  });

  describe('when passed nothing', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app).post('/screenshot');

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing email', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/screenshot')
        .send({ url: 'www.amazon.co.uk' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing url', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .post('/screenshot')
        .send({ email: 'johnsmith@gmail.com' });

      expect(response.statusCode).toBe(400);
    });
  });
});
