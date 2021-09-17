const express = require('express');
const routes = require('./routes/app');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
