// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();
app.use(express.static('dist'))

const bodyParser = require('body-parser');

/* Middleware*/
//Configure express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Point the server to dist/index.html
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Setup Server
const port = 8000;

const server = app.listen(port, listening);

function listening() {
    console.log('server running');
    console.log(`running on localhost: ${port}`);
}

//GET route that returns proejctData
app.get('/all', getData);

function getData(req, res) {
    res.send(projectData);
}

//POST route that adds incoming data to projectData
app.post('/addData', addData);

function addData(req, res) {
    projectData.temperature = req.body.temperature;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.userResponse;
    res.send(projectData);
}