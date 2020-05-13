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
const port = 3000;

const server = app.listen(port, listening);

function listening() {
    console.log('server running');
    console.log(`running on localhost: ${port}`);
}

//GET route that returns projectData
app.get('/all', getData);

function getData(req, res) {
    res.send(projectData);
}

//POST route that adds incoming data to projectData
app.post('/add', add);

function add(req, res) {
    projectData.country = req.body.country;
    projectData.city = req.body.city;
    projectData.departureDate = req.body.departureDate;
    projectData.temp = req.body.temp;
    projectData.summaryDescription = req.body.summaryDescription;
    projectData.precipitation = req.body.precipitation;
    projectData.highTemp = req.body.highTemp;
    projectData.lowTemp = req.body.lowTemp;
    projectData.code = req.body.code;
    projectData.remainingDays = req.body.remainingDays;
    res.send(projectData);
}

//for jest test
const sum = (a, b) => {
	return a + b;
  }
  
module.exports = sum; 