const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const screenshots = require('./controllers/screenshots');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
});

app.get('/', (request, response) => {
  response.send('The app is working.');
});
app.post('/register', (request, response) => {
  register.handleRegister(request, response, db, bcrypt);
});
app.post('/signin', (request, response) => {
  signin.handleSignIn(request, response, db, bcrypt);
});
app.post('/screenshot', (request, response) => {
  screenshots.handleScreenshots(request, response, db);
});

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
