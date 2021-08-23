const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

const token = '3BPHBYZ-CJM4MKA-J9W6EE1-M6S0NWG';
const width = 1920;
const height = 1080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/screenshot', (request, response) => {
  const { url } = request.body;
  const encodedUrl = encodeURIComponent(url);

  let query = 'https://shot.screenshotapi.net/screenshot';
  query += `?token=${token}&url=${encodedUrl}&width=${width}&height=${height}&output=json`;

  fetch(query)
    .then((response) => response.json())
    .then((data) => response.status(200).json(data))
    .catch((error) => response.status(500).json(error));
});

app.listen(3000, () => {
  console.log('The app is listening on port 3000.');
});
