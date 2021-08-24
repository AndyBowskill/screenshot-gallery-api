const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/screenshot', (request, response) => {
  const { url } = request.body;
  const encodedUrl = encodeURIComponent(url);

  let query = 'https://shot.screenshotapi.net/screenshot';
  query += `?token=${process.env.SCREENSHOT_API_KEY}&url=${encodedUrl}&width=900&height=506&output=json`;

  let screenshots = [];

  fetch(query)
    .then((response) => response.json())
    .then((screenshot) => {
      screenshots.push(screenshot);
      response.status(200).json(screenshots);
    })
    .catch((error) => response.status(500).json(error));
});

app.listen(3000, () => {
  console.log('The app is listening on port 3000.');
});
