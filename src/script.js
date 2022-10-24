import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputForm = document.getElementById('search-form');
const inputValue = document.querySelector('.input');
const container = document.querySelector('.gallery');
const header = document.getElementById('header');
const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt',
captionDelay: 250, })
const loadMore = document.querySelector('.load-more');

// loadMore.style.display = 'flex';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30755005-c126f789c706217abec8a0f9e';

let queryParams = {
  key: API_KEY,
  q: inputValue.value,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
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

      const renderData = data.hits
        .map(item => {
          container.insertAdjacentHTML(
            'afterbegin',

            `
        
            <div class="photo-card">
            <a class="gallery__item " href="${item.largeImageURL}">
            <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" />
          </a>
          
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${item.likes}
            </p>
            <p class="info-item">
            
            <b>Views</b>
              ${item.views}
            </p>
            <p class="info-item">
              
            <b>Comments</b>
              ${item.comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
              ${item.downloads}
            </p>
          </div>
        </div>
     `
          );
        })
        .join('');

      console.log(data);
     
      container.insertAdjacentHTML('beforeend', renderData);
  const { height: cardHeight } = container.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  lightbox.refresh();
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

let prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    header.style.top = 0;
  } else {
    header.style.top = '-90px';
  }
  prevScrollpos = currentScrollPos;
};


