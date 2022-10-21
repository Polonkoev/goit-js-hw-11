import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputForm = document.getElementById('search-form')
const inputValue = document.querySelector('.input')
const loadMore = document.querySelector('.load-more');

loadMore.style.display = 'flex'

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30755005-c126f789c706217abec8a0f9e';
let inputEl = '';
let page = 1

inputForm.addEventListener('submit', ((event) => {
    event.preventDefault();
    inputEl = inputValue.value
    query()
console.log(inputValue.value);
inputForm.reset()
}))

const searchParams = new URLSearchParams({
  key: API_KEY,
  q: `${inputEl}`,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: page,
  per_page: 40,
});



console.log(searchParams.toString()); 

async function query() {
  try {
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    const todoItems = response.data;
    console.log(`GET:from Pixabay`, todoItems);
    return todoItems;
  } catch (errors) {
    console.error(errors);
  }
}
// // query();

loadMore.addEventListener('click', ()=>{
page += 1

    console.log(inputValue);
    console.log(page);
    console.log(searchParams.toString());  
});
