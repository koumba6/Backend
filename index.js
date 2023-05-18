const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
//var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const routes = require('./routes/route');

var fs = require('fs');
  const { SerialPort } = require('serialport');
  var { ReadlineParser } = require("@serialport/parser-readline")
  const router = require('./routes/route');
 /* const { Socket } = require('socket.io'); */

 var port2 = new SerialPort({ path:'/dev/ttyUSB0',
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});
 var parser = port2.pipe(new ReadlineParser({ delimiter: '\r\n' }));
 parser.on('data', function(data) {
 // console.log(data) ;
  var donne = data.split("/");
   var capteur = donne[0];
   console.log(capteur);
   io.emit("data", {"capteur":capteur});
   io.emit("capteur",capteur)
 }
 )

const databaseLink = process.env.DATABASE_URL

mongoose.connect(databaseLink);


const database = mongoose.connection

const app = express();

app.use(cors({ origin: '*' }));


app.use(express.json());
app.use(bodyParser.json());

app.use('/api', routes);
const http = require('http').Server(app);
const io = require('socket.io')(http);
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