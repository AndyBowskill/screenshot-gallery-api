import * as database from './database.js';
import makeApp from './app.js';

const app = makeApp(database);

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
