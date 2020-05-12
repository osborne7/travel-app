// //import js
import { execute } from './js/apis.js'
import { getCountryName } from './js/countryCodes.js'
import { formatDate } from './js/formatDate.js'
import { defineI } from './js/utilityFunctions.js'
import { selectCountryCode } from './js/utilityFunctions.js'
import { selectCityName } from './js/utilityFunctions.js'

//import styles
import './styles/head.scss'
import './styles/results.scss'

//get results when submit button is clicked
document.getElementById('generate').addEventListener('click', execute);
//get results when user presses return on 'return date' field
document.getElementById('return').addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
        execute();
    }
}, false);

//export js
export {

    execute,
    getCountryName,
    formatDate,
    defineI,
    selectCountryCode,
    selectCityName

}