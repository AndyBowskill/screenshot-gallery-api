const handleRegister = (request, response, db, bcrypt) => {
  const { email, name, password } = request.body;

  if (!email || !name || !password) {
    response.status(400).json('Error registering an user.');
  }

  bcrypt.hash(password, 10, function (error, hash) {
    if (error) {
      response.status(400).json('Error registering an user.');
    } else {
      db.transaction((trx) => {
        trx
          .insert({
            hash: hash,
            email: email,
          })
          .into('login')
          .returning('email')
          .then((loginEmail) => {
            return trx('users')
              .returning('*')
              .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date(),
              })
              .then((user) => {
                response.json(user[0]);
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      }).catch((error) =>
        response.status(400).json('Error registering an user.')
      );
    }
  });
};

module.exports = {
  handleRegister,
};
