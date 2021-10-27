import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

export default function (database) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  dotenv.config();

  app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      res.status(400).json('Error registering an user.');
      return;
    }

    try {
      const { valid, data } = await database.createRegister(
        email,
        name,
        password
      );

      if (valid) {
        res.status(200).json(data);
      } else {
        res.status(400).json('Error registering an user.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json('Error signing in an user.');
      return;
    }

    try {
      const { valid, data } = await database.readSignin(email, password);

      if (valid) {
        res.status(200).json(data);
      } else {
        res.status(400).json('Error signing in an user.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.post('/googlesignin', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json('Error signing in an user.');
      return;
    }

    try {
      const { valid, data } = await database.readGoogleSignin(email);

      if (valid) {
        res.status(200).json(data);
      } else {
        res.status(400).json('Error signing in an user.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.post('/screenshot', async (req, res) => {
    const { email, url } = req.body;
    const encodedUrl = encodeURIComponent(url);

    if (!email || !url) {
      res.status(400).json('Error getting a screenshot.');
      return;
    }

    try {
      let query = 'https://shot.screenshotapi.net/screenshot';
      query += `?token=${process.env.SCREENSHOT_API_KEY}&url=${encodedUrl}&width=600&height=450&fresh=true&output=json&file_type=webp&block_ads=true&no_cookie_banners=true&wait_for_event=load`;

      const resScreenshotAPI = await fetch(query);
      const screenshotAPI = await resScreenshotAPI.json();

      const { valid, data } = await database.createScreenshot(
        email,
        screenshotAPI.screenshot,
        screenshotAPI.url
      );

      if (valid) {
        res.status(200).json(data);
      } else {
        res.status(400).json('Error getting a screenshot.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.delete('/screenshot', async (req, res) => {
    const { email, id } = req.body;

    if (!email || !id) {
      res.status(400).json('Error deleting a screenshot.');
      return;
    }

    try {
      const { valid, data } = await database.deleteScreenshot(email, id);

      if (valid) {
        res.status(200).json(data);
      } else {
        res.status(400).json('Error deleting a screenshot.');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  return app;
}
