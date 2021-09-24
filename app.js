import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

export default function (signin) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  dotenv.config();

  app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json('Error signing in an user.');
      return;
    }

    try {
      const { valid, data } = await signin(email, password);

      if (valid) {
        res.status(200).json(data);
      } else {
        res.status(400).json('Error signing in an user.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  return app;
}
