const knex = require('knex');
const bcrypt = require('bcrypt');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

async function signin(email, password) {
  let valid = false;
  let data = {};

  try {
    const emailRow = await db.select('email', 'hash').from('login').where('email', '=', email);

    const genuinePassword = await comparePassword(password, emailRow[0].hash)
    if (genuinePassword) {

      const userRow = await db.select('*').from('users').where('email', '=', email);
      const screenshotsRows = await db.select('*').from('screenshots').where('email', '=', email).orderBy('id', 'desc');

      data = {
        screenshots: screenshotsRows,
        user: {
          id: userRow[0].id,
          email: userRow[0].email,
          name: userRow[0].name
        }
      };
      valid = true;
    }
  } catch (error) {
    console.log(error);
  }

  return { valid, data };
}

async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
      console.log(error);
  }
  return false;
};

module.exports = {
  signin,
};