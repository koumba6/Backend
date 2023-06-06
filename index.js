/* const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');

const cors = require('cors');
const routes = require('./routes/route');

var fs = require('fs');
  const { SerialPort } = require('serialport');
  var { ReadlineParser } = require("@serialport/parser-readline")
  const router = require('./routes/route');
 

 var port2 = new SerialPort({ path:'/dev/ttyUSB0',
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});
 var parser = port2.pipe(new ReadlineParser({ delimiter: '\r\n' }));
 parser.on('data', function(data) {
 
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
}); */



express = require('express');
path = require('path');
mongoose = require('mongoose');
createError = require('http-errors')
cors = require('cors');
bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const app = express();
const routes = require('./routes/route');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");


require('dotenv').config();

//Here we will avoid Mongoose warming (strictQuery will be 'false')
mongoose.set('strictQuery', true);

//Here we are connecting to data base mongoDb by mongoose
mongoose.connect('mongodb+srv://koumba:bousso68@cluster0.pswtz6e.mongodb.net/Fontaine?retryWrites=true&w=majority',
    //mongoose.connect( "mongodb+srv://papa:2605@cluster0.wepa2rr.mongodb.net/homestead?retryWrites=true&w=majority", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));

//Here are adding the constant 'app' using express
/**/





//Here are managing body requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//Here are managing CORS sécurity  
app.use(cors({ origin: "*" }));


//Here we are managing endpoint for access to user model


//Here we are managing server's port (using which are giving by the system or 3000)
const port = process.env.PORT || 3000;
// const port = 8000;
server.listen(port, () => {
    console.log('Port connected to: ' + port)
});

app.use('/api', routes);

io = require('socket.io')(server,
    {
        cors:
        {
            origin: "*",
            methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
            credentials: false
        }
    });

//this middelware catch errors when the URL for endpoint is not correct and send them to the next
app.use((req, res, next) => {
    next((404))
});

app.get('/', (req, res) => {
    res.send('invalid endpoint')
});

app.use((err, req, res, next) => {
    if (!err.statusCode) ErrorEvent.statusCode = 500;
    res.status(err.statutsCode).send(err.message);
});

const { SerialPort } = require('serialport');
//var Serialport = require('serialport');
const { error } = require('console');
var { ReadlineParser } = require("@serialport/parser-readline");
//const path = require('path');
var serialport = `require('serialport')`;
var port2 = new SerialPort({ path:'/dev/ttyUSB0',
baudRate: 9600,
dataBits: 8,
parity: 'none',
stopBits: 1,
flowControl: false
});

//const parser = port2.pipe(new Readline({ delimiter: '\r\n' }))
var parser = port2.pipe(new ReadlineParser({ delimiter: '\r\n' }));
var temoin = ' ';
io.on('connection', (socket) => {
    console.log('SOCKET connected!');
    socket.on('vent', (arg) => {

        temoin = arg;
        console.log(arg)
    })
});

parser.on("data", (data) => {
 //   console.log(data);
  
    var donne = data.split("/");
    var capteur = donne[0];
    console.log(capteur);
    io.emit("data", {"capteur":capteur});
    io.emit("capteur",capteur)
});