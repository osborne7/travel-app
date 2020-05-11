//if departure date is less than a week away, return i = 0, otherwise i = 15 in order to use i as the index for pulling in weather data
function defineI(days) {
    if (days <= 7) {
        let i = 0;
        return i;
    } else {
        let i = 15;
        return i;
    }
}

function selectCountryCode(number, weather) {
    if (number === 15) {
            let country = weather.country_code;
            return country;
        } else {
            let country = weather.data[0].country_code;            
            return country;
        }
}


export { defineI, selectCountryCode }