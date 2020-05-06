// //import js
// import { postData } from './js/geonames.js'
// import { getPosition } from './js/geonames.js'
import { execute } from './js/apis.js'
// import { submitButton } from './js/eventListeners'

// //import styles
// //this style file will be deleted
import './styles/style.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/footer.scss'
import './styles/form.scss'


document.getElementById('generate').addEventListener('click', execute);


//when needed, import files for file-loader, ex: import img from './file.png';

//when needed, import html for html-loader, ex: import img from './file.png';


// //export js
export {
    execute

}
