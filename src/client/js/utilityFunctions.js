//if departure date is less than a week away, return i = 0, otherwise i = 15 in order to use i as the index for pulling in weather data
let defineI = (days) => {
    if (days <= 7) {
        let i = 0;
        return i;
    } else {
        let i = 15;
        return i;
    }
}

//future weather and current weather API calls have different criteria to access country code and city name, use i to make correct selection
let selectCountryCode = (number, weather) => {
    if (number === 15) {
            let country = weather.country_code;
            return country;
        } else {
            let country = weather.data[0].country_code;            
            return country;
        }
}

let selectCityName = (number, weather) => {
    if (number === 15) {
            let country = weather.city_name;
            return country;
        } else {
            let country = weather.data[0].city_name;            
            return country;
        }
}

//hover functionality for 
let mouseInCountry = (icon, element) => icon.addEventListener('mouseover', () => {
    element.className = ('country warning warning-text');
    element.innerHTML = 'Is the country not what you expected? If you plan to travel to a city that shares a name with cities in other countries, try the search again with the country included!';
});

let mouseInWeather = (icon, element) => icon.addEventListener('mouseover', () => {
    element.className = ('weather warning warning-text');
    element.innerHTML = 'Is your trip more than 16 days in the future? The weather results will show the forecast for 16 days from now, the last day we can get a reliable forecast.';
});

let mouseOut = (icon, element) => icon.addEventListener('mouseout', () => {
    element.classList.remove('warning-text');
    element.innerHTML = '';
});


export { defineI, selectCountryCode, selectCityName, mouseInCountry, mouseInWeather, mouseOut }