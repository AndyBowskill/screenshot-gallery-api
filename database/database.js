const db = require('../config/database');
const bcrypt = require('bcrypt');

const signIn = (email, password) => {
  let valid = false;

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((loginEmail) => {
      bcrypt.compare(password, loginEmail[0].hash, function (error, isValid) {
        if (error) {
          valid = false;
        } else {
          if (isValid) {
            db.select('*')
              .from('users')
              .where('email', '=', email)
              .then((user) => {
                db.select('*')
                  .from('screenshots')
                  .where('email', '=', email)
                  .orderBy('id', 'desc')
                  .then((screenshots) => {
                    const data = {
                      screenshots: screenshots,
                      user: {
                        id: user[0].id,
                        email: user[0].email,
                        name: user[0].name,
                      },
                    };
                    valid = true;
                  })
                  .catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          } else {
            valid = false;
          }
        }
      });
    })
    .catch((error) => console.log(error));

  return valid;
};

module.exports = {
  signIn,
};
