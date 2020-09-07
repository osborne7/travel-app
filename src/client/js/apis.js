//API keys
const username = '&username=eosborne';
const geonamesURL = 'https://secure.geonames.org/searchJSON?q=';
const weatherKey = '14ad34da755e4660a9e02f687016bf9c';
const futureWeatherURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const currentWeatherURL = 'https://api.weatherbit.io/v2.0/current?';
const pictureKey = '4809663-f2765ed7f184d8a809cca9b66';
const pictureURL = 'https://pixabay.com/api/?key=';
const container = document.getElementById('contain-entries');
const daysDifference = (date1, date2) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
let apiData = {};

//put icons into images folder within dist folder for production mode
require.context("../media/icons/", true, /\.(png|svg|jpg|gif)$/);

//import photos
import destination from '../media/img/destination.png';
import travel from '../media/img/travel.png'
import question from '../media/img/question.png'
import weather from '../media/img/weather.png'
import info from '../media/img/info.png'
import { mouseIn } from './utilityFunctions';


//POST request
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});
    try {
        const newData = await response.json();
        return newData;
    }catch(error) {
        console.log('error', error);
    }
}

//GET request to Geonames API
const getPosition = async (geonamesURL, placeName, username) => {
    const res = await fetch(geonamesURL+placeName+username);
    try {
        const userData = await res.json();
        return userData;
    } catch(error) {
        console.log('error', error);
    }
}

//request to Weatherbit API
//get current weather if trip is in under 8 days
const getCurrentWeather = async(currentWeatherURL, latitude, longitude, weatherKey) => {
        const req = await fetch(currentWeatherURL+ 'lat=' + latitude + '&lon='+ longitude + '&key='+ weatherKey + '&units=I');
        try {
            const weatherData = await req.json();
            return weatherData;
        } catch(error) {
            console.log('error', error);
}
}

//get future weather if trip is in 8 days or over
const getFutureWeather = async(futureWeatherURL, latitude, longitude, weatherKey) => {
    const req = await fetch(futureWeatherURL+ 'lat=' + latitude + '&lon='+ longitude + '&key='+ weatherKey+ '&units=I');
    try {
        //change const name
        const weatherData = await req.json();
        return weatherData;
    } catch(error) {
        console.log('error', error);
}
}

//retrieve data, then chain a POST request to add API data and user data to app
function execute(e) {
    let placeName = document.getElementById('place').value;
    const departureDate = document.getElementById('date').value;
    //get date:
    let d = new Date();
    let now = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    let remainingDays = daysDifference(now, departureDate);

    getPosition(geonamesURL, placeName, username)
    
    //chain post request to add data from API
    .then((userData) => {
        //add data to post request
        //if no results, send alert to try again
        if (userData.geonames[0] === undefined) {
            alert('No results! Please check your spelling and try again!');
        }

        const latitude = userData.geonames[0].lat;
        const longitude = userData.geonames[0].lng;

        //get current weather or future weather based on remaining days
        if (remainingDays <= 7) {
            let weather = getCurrentWeather(currentWeatherURL, latitude, longitude, weatherKey);
            let i = 0;
            return weather;
        } else if (remainingDays > 7) {
            let i = 15;
            let weather = getFutureWeather(futureWeatherURL, latitude, longitude, weatherKey);
            return weather;
        }
    })
    .then((weather) => {
        console.log(weather);

        // let accessData = (data) => {
        //     return `weather.data[0].${data}`;
        // }

        //newI is the index to use to pull in data based on days until departure
        let newI = Client.defineI(remainingDays);
        const temp = weather.data[0].temp;
        const summaryDescription = weather.data[0].weather.description;
        let country = Client.selectCountryCode(newI, weather);
        let city = Client.selectCityName(newI, weather);
        let code = weather.data[0].weather.icon;
        const windSpeed = weather.data[0].wind_spd;
        const windDirection = weather.data[0].wind_cdir_full;
        const humidity = weather.data[0].rh;
        const clouds = weather.data[0].clouds;
        // apiData = postData('/add', {country: country, city: city, departureDate: departureDate, temp: temp, summaryDescription: summaryDescription, precipitation: precipitation, highTemp: highTemp, lowTemp: lowTemp, code: code, remainingDays: remainingDays});
        apiData = postData('http://localhost:3000/add', {country: country, city: city, departureData: departureDate, temp: temp, summaryDescription: summaryDescription, windSpeed: windSpeed, windDirection: windDirection, humidity: humidity, clouds: clouds, code: code, remainingDays: remainingDays});
        return apiData;
    }).then((apiData) => {
        updateUI(apiData);
    })
}

//retrieve data from the app, inclduding picture from api, select necessary DOM elements, and update their values
 const updateUI = async (apiData) => {
    //convert multi-word entries to Paris+France instead of Paris France for Pixabay search
    let currentPlace = document.getElementById('place').value;
    let replaceSpaces = currentPlace.split(' ').join('+');

    //convert country code to full country name
    let fullCountryName = Client.getCountryName(apiData.country);
    let replaceCountrySpaces = fullCountryName.split(' ').join('+');

    //get city picture
    const res = await fetch(pictureURL + pictureKey + '&q=' + replaceSpaces + '+' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');
    try{
        const pictureData = await res.json();

        //create new date entry
        // let newDate = Client.formatDate(apiData.departureDate);
        let date = document.getElementById('date').value;
        let newDate = Client.formatDate(date);
        const returnDate = document.getElementById('return').value;

        //insertElement function
        let insertElement = (element, addClass, addID, text, prevElement, location) => {
            let newElement = document.createElement(element);
            newElement.className = addClass;
            newElement.id = addID;
            newElement.innerHTML = `${text}`;
            prevElement.insertAdjacentElement(location, newElement);
        }

        //insertContainer function
        let insertContainer = (addClass, addID, prevElement, location) => {
            let newContainer = document.createElement('div');
            newContainer.className = addClass;
            newContainer.id = addID;
            prevElement.insertAdjacentElement(location, newContainer);
        }

        //insertImage function
        let insertImage = (addClass, addID, attr1, attr2, prevElement, location) => {
            let newImage = document.createElement('img');
            newImage.className = addClass;
            newImage.id = addID;
            newImage.setAttribute(attr1, attr2);
            prevElement.insertAdjacentElement(location, newImage);
        }

        // add containers
        insertContainer('entry-holder', 'entryHolder', container, 'afterbegin');
        let entryHolder = document.getElementById('entryHolder');

        insertContainer('destination-container', 'destinationContainer', entryHolder, 'afterbegin');
        let destinationContainer = document.getElementById('destinationContainer');

        //add destination header
        insertElement('h1', 'destination-header response', 'destinationHeader', apiData.city + ',</br>' + fullCountryName, destinationContainer, 'afterbegin');
        let destinationHeader = document.getElementById('destinationHeader');

        //add travel icon
        insertImage('travel-icon icon', 'travelIcon', 'src', travel, destinationHeader, 'beforebegin');

        // get country picture if there are no pictures available of city, add picture to UI
        if (pictureData.hits[0] === undefined) {
            const res = await fetch(pictureURL + pictureKey + '&q=' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');
            let countryPictureData = await res.json();
            insertImage('class', 'image', 'src', countryPictureData.hits[0].webformatURL, destinationHeader, 'afterend');
        } else {
            insertImage('class', 'image', 'src', pictureData.hits[0].webformatURL, destinationHeader, 'afterend');
        }

        //add flex container for trip
        insertContainer('flex-container', 'tripFlex', destinationContainer, 'afterend');
        let tripFlex = document.getElementById('tripFlex');

        //create 'your trip' header
        insertElement('h1', 'results-header', 'tripHeader', 'Your Trip', tripFlex, 'afterbegin');
        let tripHeader = document.getElementById('tripHeader');

        //add trip icon
        insertImage('side-icon icon', 'tripIcon', 'src', destination, tripHeader, 'beforebegin');

        //add trip container
        insertContainer('sub-container', 'tripContainer', tripHeader, 'afterend');
        let tripContainer = document.getElementById('tripContainer');

        //date entry
        insertElement('div', 'date response', 'departureDate', 'Departure date: ' + newDate, tripContainer, 'afterbegin');
        let dateEntry = document.getElementById('departureDate');

        //return date entry
        insertElement('div', 'date response', 'returnDate', 'Return date: ' + Client.formatDate(returnDate), dateEntry, 'afterend');
        let returnEntry = document.getElementById('returnDate');

        //days until departure entry
        insertElement('div', 'days response', 'daysLeft', 'Days until your departure: ' + apiData.remainingDays, returnEntry, 'afterend');
        let daysLeftEntry = document.getElementById('daysLeft');

        //duration entry
        const duration = (`Trip duration: ${daysDifference(returnDate, newDate)} days`);
        insertElement('div', 'duration response', 'duration', duration, daysLeftEntry, 'afterend');
        let durationEntry = document.getElementById('duration');

        //city entry
        insertElement('div', 'city response', 'cityEntry', 'Destination: ' + apiData.city, durationEntry, 'afterend');
        let cityEntry = document.getElementById('cityEntry');

        //country entry
        insertElement('div', 'country response', 'countryEntry', 'Country: ' + fullCountryName, cityEntry, 'afterend');
        let countryEntry = document.getElementById('countryEntry');

        //country hover-warning and icon
        insertImage('country warning-icon warning response', 'questionIcon', 'src', question, countryEntry, 'afterend');
        let questionIcon = document.getElementById('questionIcon');
        let countryWarning = document.createElement('div');
        questionIcon.insertAdjacentElement('afterend', countryWarning);

        //hover functionality
        Client.mouseInCountry(questionIcon, countryWarning);
        Client.mouseOut(questionIcon, countryWarning);

        //weather flex container
        insertContainer('flex-container', 'weatherFlex', tripFlex, 'afterend');
        let weatherFlex = document.getElementById('weatherFlex');

        //weather header
        insertElement('h1', 'results-header', 'weatherHeader', 'Weather', weatherFlex, 'afterbegin');
        let weatherHeader = document.getElementById('weatherHeader');

        //weather icon
        insertImage('side-icon icon response', 'weatherIcon', 'src', weather, weatherHeader, 'beforebegin');

        //weather sub-container
        insertContainer('sub-container', 'weatherContainer', weatherHeader, 'afterend');
        let weatherContainer = document.getElementById('weatherContainer');

        //temperature entry
        insertElement('div', 'temp response', 'tempEntry', 'Temperature at destination: ' + apiData.temp + '&#176; F', weatherContainer, 'afterbegin');
        let weatherEntry = document.getElementById('tempEntry');

        //weather summary entry
        insertElement('div', 'weather response', 'weatherEntry', 'General forecast at destination: ' + apiData.summaryDescription, weatherEntry, 'afterend');
        let tempEntry = document.getElementById('weatherEntry');

        //weather icon entry
        let iconCode = apiData.code;
        insertImage('weather-icon response', 'iconEntry', 'src', `/images/${iconCode}.png`, tempEntry, 'afterend');
        let iconEntry = document.getElementById('iconEntry');

        //wind speed entry
        insertElement('div', 'wind response', 'windSpeed', 'Wind Speed: ' + apiData.windSpeed + ' mph', iconEntry, 'afterend');
        let windSpeedEntry = document.getElementById('windSpeed');

        //wind direction entry
        insertElement('div', 'wind response', 'windDirection', 'Wind Direction: ' + apiData.windDirection, windSpeedEntry, 'afterend');
        let windDirectionEntry = document.getElementById('windDirection');

        //humidity entry
        insertElement('div', 'humidity response', 'humidityEntry', 'Relative Humidity: ' + Math.floor(apiData.humidity) + '%', windDirectionEntry, 'afterend');
        let humidityEntry = document.getElementById('humidityEntry');

        //clouds entry
        insertElement('div', 'clouds response', 'cloudsEntry', 'Cloud Coverage: ' + apiData.clouds + '%', humidityEntry, 'afterend');
        let cloudsEntry = document.getElementById('cloudsEntry');

        //weather warning entry and icon
        insertImage('weather response warning-icon warning', 'iconEntry', 'src', info, cloudsEntry, 'afterend');
        let warningIcon = document.getElementById('iconEntry');
        let weatherWarning = document.createElement('div');
        warningIcon.insertAdjacentElement('afterend', weatherWarning);

        //hover functionality
        Client.mouseInWeather(warningIcon, weatherWarning);
        Client.mouseOut(warningIcon, weatherWarning);
        
        //scroll to results once loaded
        let scrollTo = document.getElementById('contain-entries');
        scrollTo.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
      } catch(error) {
        console.log('error', error);
    }
 }      

export { execute }