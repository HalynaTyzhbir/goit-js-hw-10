import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener("input", debounce((e) => {
    const cleanValue = inputEl.value.trim();
    listEl.innerHTML = "";
    infoEl.innerHTML = "";
    if (cleanValue !== ""){
        fetchCountries(cleanValue).then((array) => {
            if (array.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (array.length <= 10 && array.length >= 2) {
                insertContent( array);
            } else if (array.length === 1) {
                insertContentOneCountry(array);
            } else {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            }
        })
    }
}, DEBOUNCE_DELAY));

const createListItem = (item) => `<li>
<img src = "${item.flags.svg}" alt = "${item.name.official} flag" width = "300">
<h2>Name of the country: ${item.name.official}</h2>
</li>`;

const generateContent = (array) => array?.reduce((acc, item) => acc + createListItem(item), "");

const insertContent = (array) => {
    const result = generateContent(array);
    listEl.insertAdjacentHTML("beforeend", result);
};

const createListItemOneCountry = (item) => `<li>
<img src = "${item.flags.svg}" alt = "${item.name.official} flag" width = "300" height = "200">
<h2>Name of the country: ${item.name.official}</h2>
<p>Name of the capital: ${item.capital}</p>
<p>Quantuty of people: ${item.population}</p>
<p>Spoken languages: ${Object.values(item.languages)}</p>
</li>`;

const generateContentOneCountry = (array) =>  array
    .map(item => {
        return createListItemOneCountry(item);
    })
    .join('');

const insertContentOneCountry = (array) => {
    const result = generateContentOneCountry(array);
    infoEl.insertAdjacentHTML("beforeend", result);
};

