const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
