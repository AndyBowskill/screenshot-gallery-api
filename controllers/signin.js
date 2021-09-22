const database = require('../database/database');
const db = require('../config/database');
const bcrypt = require('bcrypt');

const handleSignIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json('Error signing in an user.');
  }

  const { valid, data } = database.signIn(email, password);

  if (valid) {
    res.status(200).json(data);
  } else {
    res.status(400).json('Error signing in an user.');
  }
};

module.exports = {
  handleSignIn,
};
