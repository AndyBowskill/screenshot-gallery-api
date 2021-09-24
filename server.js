import makeApp from './app.js';
import database from './database.js';

const app = makeApp(database);

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
