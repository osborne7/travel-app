//API keys
const username = '&username=eosborne';
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const weatherKey = '14ad34da755e4660a9e02f687016bf9c';
const futureWeatherURL = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const currentWeatherURL = 'http://api.weatherbit.io/v2.0/current?';
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
        //newI is the index to use to pull in data based on days until departure
        let newI = Client.defineI(remainingDays);
        const temp = weather.data[0].temp;
        const summaryDescription = weather.data[0].weather.description;
        let country = Client.selectCountryCode(newI, weather);
        let city = Client.selectCityName(newI, weather);
        let code = weather.data[0].weather.icon;
        const precipitation = weather.data[0].pop;
        const highTemp = weather.data[0].max_temp;
        const lowTemp = weather.data[0].min_temp;
        apiData = postData('http://localhost:3000/add', {country: country, city: city, departureDate: departureDate, temp: temp, summaryDescription: summaryDescription, precipitation: precipitation, highTemp: highTemp, lowTemp: lowTemp, code: code, remainingDays: remainingDays});
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
        let newDate = Client.formatDate(apiData.departureDate);

        //add containers
        let newDiv = document.createElement('div');
        newDiv.className = 'entry-holder';
        container.insertAdjacentElement('afterbegin', newDiv);

        let destinationContainer = document.createElement('div');
        destinationContainer.className = 'destination-container';
        newDiv.insertAdjacentElement('afterbegin', destinationContainer);

        //add destination header
        let destinationHeader = document.createElement('h1');
        destinationHeader.className = 'destination-header response';
        destinationHeader.innerHTML = apiData.city + ',</br>' + fullCountryName;
        destinationContainer.insertAdjacentElement('afterbegin', destinationHeader);

        //add travel icon
        let travelIcon = document.createElement('img');
        travelIcon.className = ('travel-icon icon');
        travelIcon.setAttribute('src', travel);
        destinationHeader.insertAdjacentElement('beforebegin', travelIcon);

        // get country picture if there are no pictures available of city, add picture to UI
        if (pictureData.hits[0] === undefined) {
            const res = await fetch(pictureURL + pictureKey + '&q=' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');
            let countryPictureData = await res.json();
            let countryImageEntry = document.createElement('img');
            countryImageEntry.setAttribute('id', 'image');
            countryImageEntry.setAttribute('src', countryPictureData.hits[0].webformatURL);
            destinationHeader.insertAdjacentElement('afterend', countryImageEntry);
        } else {
            let imageEntry = document.createElement('img');
            imageEntry.setAttribute('id', 'image');
            imageEntry.setAttribute('src', pictureData.hits[0].webformatURL);
            destinationHeader.insertAdjacentElement('afterend', imageEntry);
        }

        //add flex container for trip
        let tripFlex = document.createElement('div');
        tripFlex.className = 'flex-container trip-flex';
        destinationContainer.insertAdjacentElement('afterend', tripFlex);

        //create 'your trip' header
        let tripHeader = document.createElement('h1');
        tripHeader.className = 'results-header';
        tripHeader.innerHTML = 'Your Trip';
        tripFlex.insertAdjacentElement('afterbegin', tripHeader);

        //add trip icon
        let tripIcon = document.createElement('img');
        tripIcon.className = ('side-icon icon');
        tripIcon.setAttribute('src', destination);
        tripHeader.insertAdjacentElement('beforebegin', tripIcon);

        //add trip container
        let tripContainer = document.createElement('div');
        tripContainer.className = 'sub-container trip-container';
        tripHeader.insertAdjacentElement('afterend', tripContainer);

        //date entry
        let dateEntry = document.createElement('div');
        dateEntry.className = 'date response';
        dateEntry.innerHTML = ('Departure date: ' + newDate);
        tripContainer.insertAdjacentElement('afterbegin', dateEntry);
        
        //return date entry
        let returnEntry = document.createElement('div');
        returnEntry.className = 'date response';
        const returnDate = document.getElementById('return').value;
        returnEntry.innerHTML = ('Return date: ' + Client.formatDate(returnDate));
        dateEntry.insertAdjacentElement('afterend', returnEntry);

         //days until departure entry
         let daysLeftEntry = document.createElement('div');
         daysLeftEntry.className = 'days response';
         daysLeftEntry.innerHTML = 'Days until your departure: ' + apiData.remainingDays;
         returnEntry.insertAdjacentElement('afterend', daysLeftEntry);

        //duration entry
        let durationEntry = document.createElement('div');
        durationEntry.className = 'duration response';
        const duration = (`Trip duration: ${daysDifference(returnDate, apiData.departureDate)} days`);
        durationEntry.innerHTML = duration;
        daysLeftEntry.insertAdjacentElement('afterend', durationEntry);

        //city entry
        let cityEntry = document.createElement('div');
        cityEntry.className = 'city response';
        cityEntry.innerHTML = ('Destination: ' + apiData.city);
        durationEntry.insertAdjacentElement('afterend', cityEntry);

        //country entry
        let countryEntry = document.createElement('div');
        countryEntry.className = 'country response';
        countryEntry.innerHTML = ('Country: ' + fullCountryName);
        cityEntry.insertAdjacentElement('afterend', countryEntry);

        //country hover-warning and icon
        let countryWarning = document.createElement('div');
        let questionIcon = document.createElement('img');
        questionIcon.className = ('country warning-icon warning response');
        questionIcon.setAttribute('src', question);
        countryEntry.insertAdjacentElement('afterend', questionIcon);
        questionIcon.insertAdjacentElement('afterend', countryWarning);

        //hover functionality
        questionIcon.addEventListener('mouseover', () => {
            countryWarning.className = ('country warning warning-text');
            countryWarning.innerHTML = 'Is the country not what you expected? If you plan to travel to a city that shares a name with cities in other countries, try the search again with the country included!';
        });

        questionIcon.addEventListener('mouseout', () => {
            countryWarning.classList.remove('warning-text');
            countryWarning.innerHTML = '';
        });

        //weather flex container
        let weatherFlex = document.createElement('div');
        weatherFlex.className = 'flex-container weather-flex';
        tripFlex.insertAdjacentElement('afterend', weatherFlex);

        //weather header
        let weatherHeader = document.createElement('h1');
        weatherHeader.className = 'results-header';
        weatherHeader.innerHTML = 'Weather';
        weatherFlex.insertAdjacentElement('afterbegin', weatherHeader);

        //weather icon
        let weatherIcon = document.createElement('img');
        weatherIcon.className = ('side-icon response icon');
        weatherIcon.setAttribute('src', weather);
        weatherHeader.insertAdjacentElement('beforebegin', weatherIcon);

        //weather sub-container
        let weatherContainer = document.createElement('div');
        weatherContainer.className = 'sub-container weather-container';
        weatherHeader.insertAdjacentElement('afterend', weatherContainer);

        //temperature entry
        let weatherEntry = document.createElement('div');
        weatherEntry.className = 'temp response';
        weatherEntry.innerHTML = ('Temperature at destination: ' + apiData.temp + '&#176; F');
        weatherContainer.insertAdjacentElement('afterbegin', weatherEntry);

        //weather summary entry
        let tempEntry = document.createElement('div');
        tempEntry.className = 'weather response';
        tempEntry.innerHTML = ('General forecast at destination: ' + apiData.summaryDescription);
        weatherEntry.insertAdjacentElement('afterend', tempEntry);

        //weather icon entry
        let iconEntry = document.createElement('img');
        iconEntry.className = 'weather-icon response';
        let iconCode = apiData.code;
        iconEntry.setAttribute('src', `/images/${iconCode}.png`);
        tempEntry.insertAdjacentElement('afterend', iconEntry);

        //precipitation entry
        let precipEntry = document.createElement('div');
        precipEntry.className = 'precip response';
        precipEntry.innerHTML = (`Chance of Precipitation: ${apiData.precipitation}%`);
        iconEntry.insertAdjacentElement('afterend', precipEntry);

        //high temp entry
        let highTempEntry = document.createElement('div');
        highTempEntry.className = 'high-temp response';
        highTempEntry.innerHTML = ('High Temperature: ' + apiData.highTemp + '&#176; F');
        precipEntry.insertAdjacentElement('afterend', highTempEntry);

        //high temp entry
        let lowTempEntry = document.createElement('div');
        lowTempEntry.className = 'low-temp response';
        lowTempEntry.innerHTML = ('Low Temperature: ' + apiData.lowTemp) + '&#176; F';
        highTempEntry.insertAdjacentElement('afterend', lowTempEntry);

        //weather warning entry and icon
        let weatherWarning = document.createElement('div');
        let warningIcon = document.createElement('img');
        warningIcon.className = ('weather response warning-icon warning');
        warningIcon.setAttribute('src', info);
        lowTempEntry.insertAdjacentElement('afterend', warningIcon);
        warningIcon.insertAdjacentElement('afterend', weatherWarning);

        //hover functionality
        warningIcon.addEventListener('mouseover', () => {
            weatherWarning.className = ('weather warning warning-text');
            weatherWarning.innerHTML = 'Is your trip more than 16 days in the future? The weather results will show the forecast for 16 days from now, the last day we can get a reliable forecast.';
        });

        warningIcon.addEventListener('mouseout', () => {
            weatherWarning.classList.remove('warning-text');
            weatherWarning.innerHTML = '';
        });

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