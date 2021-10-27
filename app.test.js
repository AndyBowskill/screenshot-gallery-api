import request from 'supertest';
import makeApp from './app';
import { jest } from '@jest/globals';

const createRegister = jest.fn();
const readSignin = jest.fn();
const readGoogleSignin = jest.fn();
const createScreenshot = jest.fn();
const deleteScreenshot = jest.fn();

const app = makeApp({
  createRegister,
  readSignin,
  readGoogleSignin,
  createScreenshot,
  deleteScreenshot,
});

describe('POST /register', () => {
  beforeEach(() => {
    createRegister.mockReset();
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

      expect(createRegister.mock.calls.length).toBe(1);
      expect(createRegister.mock.calls[0][0]).toBe(body.email);
      expect(createRegister.mock.calls[0][1]).toBe(body.name);
      expect(createRegister.mock.calls[0][2]).toBe(body.password);
    });
  });
});

describe('POST /signin', () => {
  beforeEach(() => {
    readSignin.mockReset();
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

      expect(readSignin.mock.calls.length).toBe(1);
      expect(readSignin.mock.calls[0][0]).toBe(body.email);
      expect(readSignin.mock.calls[0][1]).toBe(body.password);
    });
  });
});

describe('POST /googlesignin', () => {
  beforeEach(() => {
    readGoogleSignin.mockReset();
  });

  describe('when passed nothing', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app).post('/googlesignin');

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed valid and complete data', () => {
    test('should get back a status code of 200', async () => {
      const body = {
        email: 'johnsmith1@gmail.com',
      };

      const response = await request(app).post('/googlesignin').send(body);

      expect(readGoogleSignin.mock.calls.length).toBe(1);
      expect(readGoogleSignin.mock.calls[0][0]).toBe(body.email);
    });
  });
});

describe('POST /screenshot', () => {
  beforeEach(() => {
    createScreenshot.mockReset();
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

describe('DELETE /screenshot', () => {
  beforeEach(() => {
    deleteScreenshot.mockReset();
  });

  describe('when passed nothing', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app).delete('/screenshot');

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing screenshot ID', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .delete('/screenshot')
        .send({ email: 'johnsmith@gmail.com' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed a missing email', () => {
    test('should get back a status code of 400', async () => {
      const response = await request(app)
        .delete('/screenshot')
        .send({ id: 123 });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('when passed valid and complete data', () => {
    test('should get back a status code of 200', async () => {
      const body = {
        email: 'johnsmith1@gmail.com',
        id: 123,
      };

      const response = await request(app).delete('/screenshot').send(body);

      expect(deleteScreenshot.mock.calls.length).toBe(1);
      expect(deleteScreenshot.mock.calls[0][0]).toBe(body.email);
      expect(deleteScreenshot.mock.calls[0][1]).toBe(body.id);
    });
  });
});
