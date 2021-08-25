const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const knex = require('knex');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
  },
});

app.post('/register', (request, response) => {
  const { email, name, password } = request.body;

  bcrypt.hash(password, 10, function(error, hash) {
    if (error) {
      response.status(400).json('Error registering an user.');
    } else {
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then(user => {
            response.json(user[0]);
          })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(error => response.status(400).json('Error registering an user.'))
    };
  });
});

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
