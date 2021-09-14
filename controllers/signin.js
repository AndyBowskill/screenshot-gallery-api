const handleSignIn = (request, response, db, bcrypt) => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json('Error signing in an user.');
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((loginEmail) => {
      bcrypt.compare(password, loginEmail[0].hash, function (error, isValid) {
        if (error) {
          response.status(400).json('Error signing in an user.');
        } else {
          if (isValid) {
            return db
              .select('*')
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

                    response.status(200).json(data);
                  })
                  .catch((error) =>
                    response.status(400).json('Error signing in an user.')
                  );
              });
          } else {
            response.status(400).json('Error signing in an user.');
          }
        }
      });
    });
};

module.exports = {
  handleSignIn,
};
