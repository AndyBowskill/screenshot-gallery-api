import { register, signin } from './database.js';
import makeApp from './app.js';

const app = makeApp(register, signin);

app.listen(process.env.PORT, () => {
  console.log(`The app is listening on port ${process.env.PORT}.`);
});
