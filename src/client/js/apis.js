// import { getCountryName } from './countryCodes';
//API keys (switch to .env?)
const username = '&username=eosborne';
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const weatherKey = '14ad34da755e4660a9e02f687016bf9c';
const futureWeatherURL = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const currentWeatherURL = 'http://api.weatherbit.io/v2.0/current?';
const pictureKey = '4809663-f2765ed7f184d8a809cca9b66';
const pictureURL = 'https://pixabay.com/api/?key=';
// let placeName = document.getElementById('place').value;
// https://cors-anywhere.herokuapp.com/
const daysDifference = (date1, date2) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
let apiData = {};


//POST request
const postData = async (url = '', data = {})=>{
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

//GET request to API
const getPosition = async (geonamesURL, placeName, username)=> {
    // let placeName = document.getElementById('place').value;
    console.log(placeName);
    const res = await fetch(geonamesURL+placeName+username);
    console.log('position response: ' + res);
    try {
        const userData = await res.json();
        console.log(userData);
        return userData;
    } catch(error) {
        console.log('error', error);
    }
}

// request to weather API
//rework this to enter total trip days
//it gives out date in YYYY-MM-DD
// temp gets average temp, pop is probability of precipitation, weather gives an icon and description, 
const getCurrentWeather = async(currentWeatherURL, latitude, longitude, weatherKey)=> {
        const req = await fetch(currentWeatherURL+ 'lat=' + latitude + '&lon='+ longitude + '&key='+ weatherKey + '&units=I');
        try {
            const weatherData = await req.json();
            console.log(weatherData);
            return weatherData;
        } catch(error) {
            console.log('error', error);
}
}

const getFutureWeather = async(futureWeatherURL, latitude, longitude, weatherKey)=> {
    const req = await fetch(futureWeatherURL+ 'lat=' + latitude + '&lon='+ longitude + '&key='+ weatherKey+ '&units=I');
    try {
        //change const name
        const weatherData = await req.json();
        console.log(weatherData);
        return weatherData;
    } catch(error) {
        console.log('error', error);
}
}

// const getPicture = async(pictureURL, pictureKey, placeName)=> {
    // console.log('current place value before grabbing picture: ' + document.getElementById('place').value)
    // let currentPlace = document.getElementById('place').value;
    // console.log('current country from apiData: ' + apiData.country);
    // let replaceSpaces = currentPlace.split(' ').join('+');
    // console.log('replaceSpaces: ' + replaceSpaces);

    // //convert country code to full country name
    // let fullCountryName = Client.getCountryName(apiData.country);
    // let replaceCountrySpaces = fullCountryName.split(' ').join('+');
    // console.log('full Country Name: ' + fullCountryName);
    // console.log('replace country spaces: ' +replaceCountrySpaces);
    // const req = await fetch(pictureURL + pictureKey + '&q=' + replaceSpaces + '+' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');
//     try {
//         const pictureData = await req.json();
//         console.log(pictureData);
//         return pictureData;
//     } catch(error) {
//         console.log('error', error);
// }
// }

// const getCountryPicture = async(pictureURL, pictureKey, placeName)=> {
   // console.log('current country from apiData: ' + apiData.country);

    // //convert country code to full country name
    // let fullCountryName = Client.getCountryName(apiData.country);
    // let replaceCountrySpaces = fullCountryName.split(' ').join('+');
    // console.log('full Country Name: ' + fullCountryName);
    // console.log('replace country spaces: ' +replaceCountrySpaces);
    // const req = await fetch(pictureURL + pictureKey + '&q=' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');
//     try {
//         const pictureData = await req.json();
//         console.log(pictureData);
//         return pictureData;
//     } catch(error) {
//         console.log('error', error);
// }
// }

//retrieve data, then chain a POST request to add API data and user data to app
function execute(e) {
    let placeName = document.getElementById('place').value;
    const departureDate = document.getElementById('date').value;
      //rework date:
      let d = new Date();
      let now = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
      console.log('now: ' + now);
    //   const daysDifference = (date1, date2) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
      console.log(daysDifference(now, departureDate));
      let remainingDays = daysDifference(now, departureDate);
      console.log('remaining days: ' + remainingDays);
  
      // let timeDifference = Math.abs((new Date(departureDate)).getTime() - (new Date()).getTime);
      // let remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      console.log('departure date: ' + departureDate)
      // console.log('timeDifference: ' + timeDifference);
      // console.log('remainingDays: ' + remainingDays);

    getPosition(geonamesURL, placeName, username)
    
    //chain post request to add data from API
    .then(function(userData) {
        //add data to post request
        // if (placeName) {
            console.log('userData: ' + userData);
            const latitude = userData.geonames[0].lat;
            console.log('latitude: ' + latitude);
            const longitude = userData.geonames[0].lng;
            console.log('longitude: ' + longitude)
            const country = userData.geonames[0].countryName;
            console.log('country: ' + country);

            // let weather = getCurrentWeather(currentWeatherURL, latitude, longitude, weatherKey);
            // return weather;

            //how would it take in the date info, or do we just want that back?? probably just want to retrieve it? need to resolve
            if (remainingDays <= 7) {
                let weather = getCurrentWeather(currentWeatherURL, latitude, longitude, weatherKey);
                return weather;
            } else if (remainingDays > 7) {
                let weather = getFutureWeather(futureWeatherURL, latitude, longitude, weatherKey);
                return weather;
            }

        }).then((weather) => {
            console.log('weather data: ' + weather)
            const temp = weather.data[0].temp;
            console.log('temp: ' + temp);
            const summaryDescription = weather.data[0].weather.description;
            console.log('summary description: ' + summaryDescription);
            const country = weather.country_code;
            let code = weather.data[0].weather.icon;
            console.log('country: ' + country);
            // apiData.summaryDescription = weather.data[0].weather.description;
            apiData = postData('http://localhost:3000/add', {placeName: placeName, country: country, departureDate: departureDate, temp: temp, summaryDescription: summaryDescription, code: code, remainingDays: remainingDays});
            console.log('apiData: ' + apiData);
            return apiData;
        }).then((apiData) => {
            updateUI(apiData);
        })
}

// //retrieve data from the app, inclduding picture from api, select necessary DOM elements, and update their values
 const updateUI = async (apiData) => {
    // q= has to be separated by + symbols if multiple words, check this
    console.log('current place value before grabbing picture: ' + document.getElementById('place').value)
    let currentPlace = document.getElementById('place').value;
    console.log('current country from apiData: ' + apiData.country);
    let replaceSpaces = currentPlace.split(' ').join('+');
    console.log('replaceSpaces: ' + replaceSpaces);

    //convert country code to full country name
    let fullCountryName = Client.getCountryName(apiData.country);
    let replaceCountrySpaces = fullCountryName.split(' ').join('+');
    console.log('full Country Name: ' + fullCountryName);
    console.log('replace country spaces: ' +replaceCountrySpaces);
    const res = await fetch(pictureURL + pictureKey + '&q=' + replaceSpaces + '+' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');

    try{
        const pictureData = await res.json();
        console.log('pictureData: ' + pictureData);

                //double check all these when updating HTML/css
        //create new date entry

        //add this to a different js page and import
        const formatDate = function(input) {
            var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
            if (!input || !input.match(pattern)) {
              return null;
            }
            return input.replace(pattern, '$2/$3/$1');
          };

          let newDate = formatDate(apiData.departureDate);

        let newDiv = document.createElement('div');
        newDiv.className = 'entry-holder';
        let container = document.getElementById('contain-entries');
        container.insertAdjacentElement('afterbegin', newDiv);
        let dateEntry = document.createElement('div');
        dateEntry.className = 'date response';
        // const departureDate = document.getElementById('date').value;
        dateEntry.innerHTML = ('Departure date: ' + newDate);
        newDiv.insertAdjacentElement('afterbegin', dateEntry);
        
        //return date entry
        let returnEntry = document.createElement('div');
        returnEntry.className = 'date response';
        const returnDate = document.getElementById('return').value;
        console.log('return date: ' + returnDate);
        returnEntry.innerHTML = ('Return date: ' + formatDate(returnDate));
        dateEntry.insertAdjacentElement('afterend', returnEntry);

        //duration entry

        let durationEntry = document.createElement('div');
        durationEntry.className = 'duration response';
        const duration = (`Trip duration: ${daysDifference(returnDate, apiData.departureDate)} days`);
        durationEntry.innerHTML = duration;
        returnEntry.insertAdjacentElement('afterend', durationEntry);

        //create new city entry
        let cityEntry = document.createElement('div');
        cityEntry.className = 'city response';
        cityEntry.innerHTML = ('Destination: ' + apiData.placeName);
        durationEntry.insertAdjacentElement('afterend', cityEntry);

        //create new country entry
        let countryEntry = document.createElement('div');
        countryEntry.className = 'country response';
        countryEntry.innerHTML = ('Country: ' + fullCountryName);
        cityEntry.insertAdjacentElement('afterend', countryEntry);

        let countryWarning = document.createElement('div');
        countryWarning.className = ('country response warning');
        countryWarning.innerHTML = 'Is the country not what you expected? If you plan to travel to a city that shares a name with cities in other countries, try the search again with the country included!';
        let warningIcon = document.createElement('img');
        warningIcon.className = ('country response icon');
        warningIcon.setAttribute('src', 'src/client/media/img/info.png');
        countryEntry.insertAdjacentElement('afterend', warningIcon);
        warningIcon.insertAdjacentElement('afterend', countryWarning);

        //create new days until departure entry
        let daysLeftEntry = document.createElement('div');
        daysLeftEntry.className = 'days response';
        daysLeftEntry.innerHTML = 'Days until your departure: ' + apiData.remainingDays;
        countryWarning.insertAdjacentElement('afterend', daysLeftEntry);

        //create weather temperature entry
        let weatherEntry = document.createElement('div');
        weatherEntry.className = 'temp response';
        console.log('apiData.temp: ' + apiData.temp);
        weatherEntry.innerHTML = ('Temperature at destination: ' + apiData.temp + '&#176; F');
        daysLeftEntry.insertAdjacentElement('afterend', weatherEntry);

        //create summary entry
        let tempEntry = document.createElement('div');
        tempEntry.className = 'weather response';
        console.log('apiData.summaryDescription: ' + apiData.summaryDescription);
        tempEntry.innerHTML = ('General forecast at destination: ' + apiData.summaryDescription);
        weatherEntry.insertAdjacentElement('afterend', tempEntry);

        // create icon entry
        let iconEntry = document.createElement('img');
        iconEntry.className = 'icon response';
        let iconCode = apiData.code;
        console.log('apiData.iconCode: ' + iconCode);
        iconEntry.setAttribute('src', `src/client/media/icons/${iconCode}.png`);
        tempEntry.insertAdjacentElement('afterend', iconEntry);

        //create image entry
        let imageEntry = document.createElement('img');
        imageEntry.className = 'image response';
        imageEntry.setAttribute('src', pictureData.hits[0].webformatURL);
        iconEntry.insertAdjacentElement('afterend', imageEntry);
      } catch(error) {
        console.log('error', error);
    }
 }      


export { execute }