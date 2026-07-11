const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./db/connect');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/contacts', require('./routes/contacts'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

initDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}`);
        });
    })
    .catch((err) => console.log(err));