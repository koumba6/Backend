const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/route');

const databaseLink = process.env.DATABASE_URL

mongoose.connect(databaseLink);
const database = mongoose.connection

const app = express();

app.use(cors({ origin: '*' }));


app.use(express.json());
app.use(bodyParser.json());

app.use('/api', routes);

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening on port " + port);
});