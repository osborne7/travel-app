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

//GET request to Geonames API
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
        const req = await fetch(currentWeatherURL+ 'lat=' + latitude + '&lon='+ longitude + '&key='+ weatherKey);
        try {
            const weatherData = await req.json();
            console.log(weatherData);
            return weatherData;
        } catch(error) {
            console.log('error', error);
}
}

const getFutureWeather = async(futureWeatherURL, latitude, longitude, weatherKey)=> {
    const req = await fetch(futureWeatherURL+ 'lat=' + latitude + '&lon='+ longitude + '&key='+ weatherKey);
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
//     // q= might have to be separated by + symbols if multiple words, check this
//     const req = await fetch(pictureURL + pictureKey + '$q=' + placeName + '&image_type=photo');
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
    const daysDifference = (date1, date2) => Math.ceil(Math.abs(new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24));
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

            let weather = getCurrentWeather(currentWeatherURL, latitude, longitude, weatherKey);
            // (console.log(weather.data[0].temp));
            return weather;

            //how would it take in the date info, or do we just want that back?? probably just want to retrieve it? need to resolve
            // if (remainingDays <= 7) {
            //     let weather = getCurrentWeather(currentWeatherURL, latitude, longitude, weatherKey);
            //     return weather;
            // } else if (remainingDays > 7) {
            //     weather = getFutureWeather(futureWeatherURL, latitude, longitude, weatherKey);
            //     return weather;
            // }

        }).then((weather) => {
            console.log('weather data: ' + weather)
            const temp = weather.data[0].temp;
            console.log('temp: ' + temp);
            const summary = weather.data[0].weather;
            console.log('summary: ' + summary);
            const apiData = postData('http://localhost:3000/add', {placeName: placeName, departureDate: departureDate, temp: temp, summary: summary, remainingDays: remainingDays});
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
    const request = await fetch(pictureURL + pictureKey + '&q=' + document.getElementById('place').value + '&image_type=photo&pretty=true');

    try{
        const pictureData = await request.json();
        console.log('pictureData: ' + pictureData);

        //double check all these when updating HTML
        //create new date entry
        let newDiv = document.createElement('div');
        newDiv.className = 'entry-holder';
        let container = document.getElementById('contain-entries');
        container.insertAdjacentElement('afterbegin', newDiv);
        let dateEntry = document.createElement('div');
        dateEntry.className = 'date response';
        // const departureDate = document.getElementById('date').value;
        dateEntry.innerHTML = ('Departure date: ' + apiData.departureDate);
        newDiv.insertAdjacentElement('afterbegin', dateEntry);

        //create new city entry
        let cityEntry = document.createElement('div');
        cityEntry.className = 'city response';
        cityEntry.innerHTML = ('Destination: ' + apiData.placeName);
        dateEntry.insertAdjacentElement('afterend', cityEntry);

        //create new days until departure entry
        let daysLeftEntry = document.createElement('div');
        daysLeftEntry.className = 'days response';
        daysLeftEntry.innerHTML = 'Days until your departure: ' + apiData.remainingDays;
        cityEntry.insertAdjacentElement('afterend', daysLeftEntry);

        //create weather summary entry
        let weatherEntry = document.createElement('div');
        weatherEntry.className = 'weather response';
        weatherEntry.innerHTML = ('Temperature at destination: ' + apiData.temp);
        daysLeftEntry.insertAdjacentElement('afterend', weatherEntry);


        //create temperature entry
        let tempEntry = document.createElement('div');
        tempEntry.className = 'temp response';
        tempEntry.innerHTML = ('General forecast at destination: ' + apiData.summary);
        weatherEntry.insertAdjacentElement('afterend', tempEntry);


        //create image entry
        let imageEntry = document.createElement('div');
        imageEntry.className = 'image response';
        imageEntry.setAttribute('src', pictureData.hits[0].webFormatURL);
        tempEntry.insertAdjacentElement('afterend', imageEntry);

      } catch(error) {
        console.log('error', error);
    }
 }      


export { execute }