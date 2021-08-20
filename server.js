const express = require('express');
const cors = require('cors'); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/screenshot/', (request, response) => {
    const {url} = request.body;
    response.json({"url": url});
});

app.listen(3000, () => {
    console.log('The app is listening on port 3000.');
});