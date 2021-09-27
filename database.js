import knex from 'knex';
import bcrypt from 'bcrypt';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export async function register(email, name, password) {
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

export async function signin(email, password) {
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

async function newPassword(password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
  }
  return false;
}

async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }
  return false;
}
