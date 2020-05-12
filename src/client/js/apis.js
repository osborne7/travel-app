//API keys (switch to .env?)
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
            if (userData.geonames[0] === undefined) {
                alert('No results! Please check your spelling and try again!');
            }
            const latitude = userData.geonames[0].lat;
            console.log('latitude: ' + latitude);
            const longitude = userData.geonames[0].lng;
            console.log('longitude: ' + longitude)
            const country = userData.geonames[0].countryName;
            console.log('country: ' + country);

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
            console.log('weather data: ' + weather);
            let newI = Client.defineI(remainingDays);
            console.log('new1: ' + newI);
            const temp = weather.data[0].temp;
            console.log('temp: ' + temp);
            const summaryDescription = weather.data[0].weather.description;
            console.log('summary description: ' + summaryDescription);
            let country = Client.selectCountryCode(newI, weather);
            let city = Client.selectCityName(newI, weather);
            // let country = weather.data[0].country_code;
            let code = weather.data[0].weather.icon;
            const precipitation = weather.data[0].pop;
            const highTemp = weather.data[0].max_temp;
            const lowTemp = weather.data[0].min_temp;
            console.log('country: ' + country);
            // apiData.summaryDescription = weather.data[0].weather.description;
            apiData = postData('http://localhost:3000/add', {country: country, city: city, departureDate: departureDate, temp: temp, summaryDescription: summaryDescription, precipitation: precipitation, highTemp: highTemp, lowTemp: lowTemp, code: code, remainingDays: remainingDays});
            console.log('apiData: ' + apiData);
            return apiData;
        }).then((apiData) => {
            updateUI(apiData);
            // getCountryPicture(apiData);
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
    // get city picture
    const res = await fetch(pictureURL + pictureKey + '&q=' + replaceSpaces + '+' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');

    try{
        const pictureData = await res.json();
        console.log('pictureData: ' + pictureData);

        //double check all these when updating HTML/css
        //create new date entry
        let newDate = Client.formatDate(apiData.departureDate);

        let newDiv = document.createElement('div');
        newDiv.className = 'entry-holder';
        // let container = document.getElementById('contain-entries');
        container.insertAdjacentElement('afterbegin', newDiv);

        let destinationContainer = document.createElement('div');
        destinationContainer.className = 'destination-container';
        // weatherContainer.innerHTML = 'Weather';
        newDiv.insertAdjacentElement('afterbegin', destinationContainer);

        let destinationHeader = document.createElement('h1');
        destinationHeader.className = 'destination-header response';
        destinationHeader.innerHTML = apiData.city + ',</br>' + fullCountryName;
        destinationContainer.insertAdjacentElement('afterbegin', destinationHeader);



        let travelIcon = document.createElement('img');
        travelIcon.className = ('travel-icon icon');
        travelIcon.setAttribute('src', 'src/client/media/img/travel.png');
        destinationHeader.insertAdjacentElement('beforebegin', travelIcon);
        // questionIcon.insertAdjacentElement('afterend', countryWarning);

        // get country picture if there are no pictures available of city
        if (pictureData.hits[0] === undefined) {
            console.log('pictureData was undefined');
            const res = await fetch(pictureURL + pictureKey + '&q=' + replaceCountrySpaces + '&image_type=photo&pretty=true&category=travel');
            let countryPictureData = await res.json();
            console.log(countryPictureData);

            // getCountryPicture(pictureURL, pictureKey, replaceCountrySpaces);
                let countryImageEntry = document.createElement('img');
                // countryImageEntry.className = 'image response';
                countryImageEntry.setAttribute('id', 'image');
                countryImageEntry.setAttribute('src', countryPictureData.hits[0].webformatURL);
                // container.insertAdjacentElement('afterbegin', countryImageEntry);
                //this bit isn't working:
                destinationHeader.insertAdjacentElement('afterend', countryImageEntry);
        } else {
            let imageEntry = document.createElement('img');
            imageEntry.setAttribute('id', 'image');
            imageEntry.setAttribute('src', pictureData.hits[0].webformatURL);
            destinationHeader.insertAdjacentElement('afterend', imageEntry);
        }


        let tripFlex = document.createElement('div');
        tripFlex.className = 'flex-container trip-flex';
        destinationContainer.insertAdjacentElement('afterend', tripFlex);

        // let image = document.getElementById('image');
        console.log('back to regular list');
        //create your trip header
        let tripHeader = document.createElement('h1');
        tripHeader.className = 'results-header';
        tripHeader.innerHTML = 'Your Trip';
        tripFlex.insertAdjacentElement('afterbegin', tripHeader);

        let tripIcon = document.createElement('img');
        tripIcon.className = ('side-icon icon');
        tripIcon.setAttribute('src', 'src/client/media/img/destination.png');
        tripHeader.insertAdjacentElement('beforebegin', tripIcon);


        let tripContainer = document.createElement('div');
        tripContainer.className = 'sub-container trip-container';
        tripHeader.insertAdjacentElement('afterend', tripContainer);

        let dateEntry = document.createElement('div');
        dateEntry.className = 'date response';
        // const departureDate = document.getElementById('date').value;
        dateEntry.innerHTML = ('Departure date: ' + newDate);
        tripContainer.insertAdjacentElement('afterbegin', dateEntry);
        
        //return date entry
        let returnEntry = document.createElement('div');
        returnEntry.className = 'date response';
        const returnDate = document.getElementById('return').value;
        console.log('return date: ' + returnDate);
        returnEntry.innerHTML = ('Return date: ' + Client.formatDate(returnDate));
        dateEntry.insertAdjacentElement('afterend', returnEntry);

         //create new days until departure entry
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

        //create new city entry
        let cityEntry = document.createElement('div');
        cityEntry.className = 'city response';
        cityEntry.innerHTML = ('Destination: ' + apiData.city);
        durationEntry.insertAdjacentElement('afterend', cityEntry);

        //create new country entry
        let countryEntry = document.createElement('div');
        countryEntry.className = 'country response';
        countryEntry.innerHTML = ('Country: ' + fullCountryName);
        cityEntry.insertAdjacentElement('afterend', countryEntry);

        let countryWarning = document.createElement('div');
        // let countryWarningText = document.createElement('span');
        // countryWarning.className = ('country warning');
        // countryWarningText.className = ('country warning warning-text');
        // countryWarningText.innerHTML = 'Is the country not what you expected? If you plan to travel to a city that shares a name with cities in other countries, try the search again with the country included!';
        let questionIcon = document.createElement('img');
        questionIcon.className = ('country warning-icon warning response');
        questionIcon.setAttribute('src', 'src/client/media/img/question.png');
        countryEntry.insertAdjacentElement('afterend', questionIcon);
        questionIcon.insertAdjacentElement('afterend', countryWarning);
        // let countryWarningText = document.createElement('span');
        // countryWarningText.className = ('country warning warning-text');
        // questionIcon.insertAdjacentElement('afterend', countryWarningText);


        // let weatherWarning = document.createElement('div');
        // weatherWarning.className = ('weather warning');
        // weatherWarning.innerHTML = 'Is your trip more than 16 days in the future? The weather results will show the forecast for 16 days from now, the last day we can get a reliable forecast.';
        // let warningIcon = document.createElement('img');
        // warningIcon.className = ('weather response warning-icon warning');
        // warningIcon.setAttribute('src', 'src/client/media/img/info.png');
        // weatherEntry.insertAdjacentElement('afterend', warningIcon);
        // warningIcon.insertAdjacentElement('afterend', weatherWarning);




        // countryWarning.insertAdjacentElement('afterbegin', countryWarningText);
        // questionIcon.insertAdjacentElement('afterend', countryWarning);

        questionIcon.addEventListener('mouseover', function(){
            countryWarning.className = ('country warning warning-text');
            countryWarning.innerHTML = 'Is the country not what you expected? If you plan to travel to a city that shares a name with cities in other countries, try the search again with the country included!';
        })

        questionIcon.addEventListener('mouseout', function(){
            countryWarning.classList.remove('warning-text');
            countryWarning.innerHTML = '';
        })
  

        // //create new days until departure entry
        // let daysLeftEntry = document.createElement('div');
        // daysLeftEntry.className = 'days response';
        // daysLeftEntry.innerHTML = 'Days until your departure: ' + apiData.remainingDays;
        // countryWarning.insertAdjacentElement('afterend', daysLeftEntry);

        let weatherFlex = document.createElement('div');
        weatherFlex.className = 'flex-container weather-flex';
        tripFlex.insertAdjacentElement('afterend', weatherFlex);

        let weatherHeader = document.createElement('h1');
        weatherHeader.className = 'results-header';
        weatherHeader.innerHTML = 'Weather';
        weatherFlex.insertAdjacentElement('afterbegin', weatherHeader);

        let weatherIcon = document.createElement('img');
        weatherIcon.className = ('side-icon response icon');
        weatherIcon.setAttribute('src', 'src/client/media/img/weather.png');
        weatherHeader.insertAdjacentElement('beforebegin', weatherIcon);


        let weatherContainer = document.createElement('div');
        weatherContainer.className = 'sub-container weather-container';
        // weatherContainer.innerHTML = 'Weather';
        weatherHeader.insertAdjacentElement('afterend', weatherContainer);

        // let weatherHeader = document.createElement('h2');
        // weatherHeader.innerHTML = 'Weather';
        // weatherEntry.insertAdjacentElement('beforebegin', weatherHeader);

        //create weather temperature entry - do something here to let know that the farthest out forecast is 16days from now
        let weatherEntry = document.createElement('div');
        weatherEntry.className = 'temp response';
        console.log('apiData.temp: ' + apiData.temp);
        weatherEntry.innerHTML = ('Temperature at destination: ' + apiData.temp + '&#176; F');
        weatherContainer.insertAdjacentElement('afterbegin', weatherEntry);


        // let weatherHeader = document.createElement('h1');
        // weatherHeader.className = 'results-header';
        // weatherHeader.innerHTML = 'Weather ->';
        // weatherEntry.insertAdjacentElement('beforebegin', weatherHeader);


        

        //create summary entry
        let tempEntry = document.createElement('div');
        tempEntry.className = 'weather response';
        console.log('apiData.summaryDescription: ' + apiData.summaryDescription);
        tempEntry.innerHTML = ('General forecast at destination: ' + apiData.summaryDescription);
        weatherEntry.insertAdjacentElement('afterend', tempEntry);

        // create icon entry
        let iconEntry = document.createElement('img');
        iconEntry.className = 'weather-icon response';
        let iconCode = apiData.code;
        console.log('apiData.iconCode: ' + iconCode);
        iconEntry.setAttribute('src', `src/client/media/icons/${iconCode}.png`);
        tempEntry.insertAdjacentElement('afterend', iconEntry);

        //create precipitation entry
        let precipEntry = document.createElement('div');
        precipEntry.className = 'precip response';
        console.log('apiData.precipitation: ' + apiData.precipitation);
        precipEntry.innerHTML = (`Chance of Precipitation: ${apiData.precipitation}%`);
        iconEntry.insertAdjacentElement('afterend', precipEntry);

        //create high temp entry
        let highTempEntry = document.createElement('div');
        highTempEntry.className = 'high-temp response';
        console.log('apiData.highTemp: ' + apiData.highTemp);
        highTempEntry.innerHTML = ('High Temperature: ' + apiData.highTemp + '&#176; F');
        precipEntry.insertAdjacentElement('afterend', highTempEntry);

        //create high temp entry
        let lowTempEntry = document.createElement('div');
        lowTempEntry.className = 'low-temp response';
        console.log('apiData.highTemp: ' + apiData.lowTemp);
        lowTempEntry.innerHTML = ('Low Temperature: ' + apiData.lowTemp) + '&#176; F';
        highTempEntry.insertAdjacentElement('afterend', lowTempEntry);

        let weatherWarning = document.createElement('div');
        // weatherWarning.className = ('weather warning');
        // weatherWarning.innerHTML = 'Is your trip more than 16 days in the future? The weather results will show the forecast for 16 days from now, the last day we can get a reliable forecast.';
        let warningIcon = document.createElement('img');
        warningIcon.className = ('weather response warning-icon warning');
        warningIcon.setAttribute('src', 'src/client/media/img/info.png');
        lowTempEntry.insertAdjacentElement('afterend', warningIcon);
        warningIcon.insertAdjacentElement('afterend', weatherWarning);

        warningIcon.addEventListener('mouseover', function(){
            weatherWarning.className = ('weather warning warning-text');
            weatherWarning.innerHTML = 'Is your trip more than 16 days in the future? The weather results will show the forecast for 16 days from now, the last day we can get a reliable forecast.';
        })

        warningIcon.addEventListener('mouseout', function(){
        weatherWarning.classList.remove('warning-text');
            weatherWarning.innerHTML = '';
        })

        let scrollTo = document.getElementById('contain-entries');
        scrollTo.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })

        //create image entry
        // let imageEntry = document.createElement('img');
        // imageEntry.className = 'image response';
        // imageEntry.setAttribute('src', pictureData.hits[0].webformatURL);
        // lowTempEntry.insertAdjacentElement('afterend', imageEntry);
      } catch(error) {
        console.log('error', error);
    }
 }      


export { execute }