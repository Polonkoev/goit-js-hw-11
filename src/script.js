import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputForm = document.getElementById('search-form');
const inputValue = document.querySelector('.input');
const container = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

// loadMore.style.display = 'flex';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30755005-c126f789c706217abec8a0f9e';
let inputEl = '';
let page = 1;

let queryParams = {
  key: API_KEY,
  q: inputValue.value,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: page,
  per_page: 40,
};

inputForm.addEventListener('submit', event => {
  event.preventDefault();

  container.innerHTML = '';
  queryParams.q = inputValue.value;

  query()
    .then(response => {
      if (response.status !== 200) {
        throw new Error();
      }
      return response.data;
    })
    .then(data => {
      console.log(data);
      if (data.total === 0) {
        Notify.failure('Sorry! Images not found.');
      } else {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }

      data.hits.map(item => {
        container.insertAdjacentHTML(
          'afterbegin',
          `<div class="photo-card">
      <img src="${item.previewURL}" width=150 height=100 alt="${item.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes ${item.likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${item.views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${item.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${item.downloads}</b>
        </p>
      </div>
    </div>`
        );
      });

      console.log(data);
      // Data handling
    })
    .catch(error => {
      console.error(error);
    });
  inputForm.reset();
});

async function query() {
  try {
    const searchParams = new URLSearchParams(queryParams);
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    const todoItems = response;
    console.log(response.status);
    console.log(searchParams.toString());
    console.log(`RESPONSE:from Pixabay`, todoItems);
    return todoItems;
  } catch (errors) {
    console.error(errors);
  }
}

