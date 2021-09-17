const express = require('express');
const routes = require('./routes/app');

const app = express();

app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
