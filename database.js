import knex from 'knex';
import { newPassword, comparePassword } from './databaseUtilities.js';

// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'screenshot-gallery'
  }
});

export async function createRegister(email, name, password) {
  let valid = false;
  let data = {};

  if (!email || !name || !password) {
    return { valid, data };
  }

  try {
    const hash = await newPassword(password);
    if (hash) {
      await db.transaction(async (trx) => {
        await trx('login')
          .insert({
            hash: hash,
            email: email,
          })
          .transacting(trx);

        await trx('users')
          .insert({
            email: email,
            name: name,
            joined: new Date(),
          })
          .transacting(trx);

        data = {
          user: {
            email: email,
            name: name,
          },
        };
        valid = true;
      });
    }
  } catch (error) {
    console.log(error);
  }

  return { valid, data };
}

export async function readSignin(email, password) {
  let valid = false;
  let data = {};

  try {
    const emailRow = await db
      .select('email', 'hash')
      .from('login')
      .where('email', '=', email);

    const genuinePassword = await comparePassword(password, emailRow[0].hash);
    if (genuinePassword) {
      const userRow = await db
        .select('*')
        .from('users')
        .where('email', '=', email);
      const screenshotsRows = await db
        .select('*')
        .from('screenshots')
        .where('email', '=', email)
        .orderBy('id', 'desc');

      data = {
        screenshots: screenshotsRows,
        user: {
          id: userRow[0].id,
          email: userRow[0].email,
          name: userRow[0].name,
        },
      };
      valid = true;
    }
  } catch (error) {
    console.log(error);
  }

  return { valid, data };
}

export async function readGoogleSignin(googleEmail) {
  let valid = false;
  let data = {};

  try {
    const screenshotsRows = await db
      .select('*')
      .from('screenshots')
      .where('email', '=', googleEmail)
      .orderBy('id', 'desc');

    data = {
      screenshots: screenshotsRows,
      user: {
        id: 0,
        email: googleEmail,
        name: '',
      },
    };
    valid = true;
  } catch (error) {
    console.log(error);
  }

  return { valid, data };
}

export async function createScreenshot(email, screenshot, url) {
  let valid = false;
  let data = {};

  if (!email || !screenshot || !url) {
    return { valid, data };
  }

  try {
    const newScreenshotRow = await db
      .insert({
        email: email,
        screenshot: screenshot,
        url: url,
      })
      .into('screenshots');

    const screenshotRows = await db
      .select('*')
      .from('screenshots')
      .where('email', '=', email)
      .orderBy('id', 'desc');

    data = {
      screenshots: screenshotRows,
      user: {
        email: email,
      },
    };
    valid = true;
  } catch (error) {
    console.log(error);
  }

  return { valid, data };
}

export async function deleteScreenshot(email, id) {
  let valid = false;
  let data = {};

  if (!email || !id) {
    return { valid, data };
  }

  try {
    const deleteScreenshotRow = await db('screenshots').where('id', id).del();

    const screenshotRows = await db
      .select('*')
      .from('screenshots')
      .where('email', '=', email)
      .orderBy('id', 'desc');

    data = {
      screenshots: screenshotRows,
      user: {
        email: email,
      },
    };
    valid = true;
  } catch (error) {
    console.log(error);
  }

  return { valid, data };
}
