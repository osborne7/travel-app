// //create a new date instance dynamically
// let d = new Date();
// let newDate = (d.getMonth()+ 1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// //API setup
// const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
// const apiKey = '&APPID=de063bd15d383b20f99e0db333194bf8';


//Geonames API (switch to .env?)
const username = '&username=eosborne';
const geonamesURL = 'http://api.geonames.org/postalCodeSearch?placename='



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
    const res = await fetch(geonamesURL+placeName+username);
    try {
        const userData = await res.json();
        return userData;
    } catch(error) {
        console.log('error', error);
    }
}

//access 'post' button and run 'execute' function when clicked
//need to create this element (or update it it)
document.getElementById('generate').addEventListener('click', execute);

//retrieve data, then chain a POST request to add API data and user data to app
function execute(e) {
    //need to make this element
    let placeName = document.getElementById('user-place').value;

    // const userFeelings = document.getElementById('feelings').value;

    getPosition(geonamesURL, placeName, username)

    
    //chain post request to add data from API
    .then(function(userData) {
        //add data to post request
        // if (placeName) {
            console.log(userData);
            // let kelvinTemp = userData.main.temp;
            // let imperialTemp = ((kelvinTemp - 273.15) * 9/5 + 32);
            // let roundedTemp = Math.floor(imperialTemp);
            postData('/addGeo', {latitude: userData.main.lat, longitude: userData.main.lng, country: userData.main.countryCode});
        // } else {
        //     postData('/addData', {temperature: 'mystery', date: newDate, userResponse: userFeelings});
        // }
        })
        //update the UI dynamically
        //////not updating the UI at this step, waiting to interact with more APIs
        // .then(function() {
        //     updateUI()
        //  }
        // )
}

// //retrieve data from the app, select necessary DOM elements, and update their values
//  const updateUI = async () => {
//     const request = await fetch('/all');

//     try{
//         const allData = await request.json();

//         //create new date entry
//         let newDiv = document.createElement('div');
//         newDiv.className = 'entry-holder';
//         let title = document.getElementById('contain-entries');
//         title.insertAdjacentElement('afterbegin', newDiv);
//         let dateDiv = document.createElement('div');
//         dateDiv.className = 'date response';
//         dateDiv.innerHTML = allData.date;
//         newDiv.insertAdjacentElement('afterbegin', dateDiv);

//         //create new temperature entry
//         let tempDiv = document.createElement('div');
//         tempDiv.className = 'temp response';
//         tempDiv.innerHTML = (`currently: ${allData.temperature}&#176;`);
//         dateDiv.insertAdjacentElement('afterend', tempDiv);

//         //create new user response entry
//         let userDiv = document.createElement('div');
//         userDiv.className = 'content response';
//         userDiv.innerHTML = allData.userResponse;
//         tempDiv.insertAdjacentElement('afterend', userDiv);

//       } catch(error) {
//         console.log('error', error);
//     }
//  }           

// //change name
//  export { functionToBeNamed }

//remember to use Client.yourFunction to reference functions on different pages