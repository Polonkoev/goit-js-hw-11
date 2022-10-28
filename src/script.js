import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const body = document.querySelector('body');
const form = document.getElementById('search-form');
const inputEl = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const header = document.getElementById('header');
const themeBtn = document.getElementById('theme-btn');
const logoImg = document.querySelector('.tumbler-img');
const loadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30755005-c126f789c706217abec8a0f9e';



let queryParams = {
  key: API_KEY,
  q: inputEl.value,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

form.addEventListener('submit', event => {
  event.preventDefault();
  if (inputEl.value === '') {
    Notify.warning('Enter something to request..');
  } else {
    gallery.innerHTML = '';
    queryParams.q = inputEl.value;
    queryParams.page = 1;
    queryFunction();
  }
});


//query function

function queryFunction() {
  query()
    .then(response => {
      if (response.status !== 200) {
        throw new Error();
      }
      return response.data;
    })
    .then(data => {
      if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }

      if ((data.hits.length < 40) & (data.hits.length !== 0)) {
        loadMore.style.display = 'none';
        Notify.warning(
          "We're sorry, but you've reached the end of search results.!"
        );
      } else if (data.hits.length === 40) {
        loadMore.style.display = 'flex';
      }


      // render HTML 

      const renderData = data.hits
        .map(item => {
          gallery.insertAdjacentHTML(
            'beforeend',
            `<div class="photo-card">
            <div class="img-wrapper">
              <a class="gallery__item " href="${item.largeImageURL}">
              <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" />
            </a>
            </div>
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

      if (data.total !== 0) {
        gallery.insertAdjacentHTML('beforeend', renderData);
        const { height: cardHeight } =
          gallery.firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
      lightbox.refresh();
    })
    .catch(error => {
      console.error(error);
    });
  form.reset();
}


// async query function

async function query() {
  try {
    const searchParams = new URLSearchParams(queryParams);
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    const todoItems = response;

    return todoItems;
  } catch (errors) {
    console.error(errors);
  }
}

//Smooth scrolling

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

//Theme switcher

themeBtn.addEventListener('click', () => {
  if (themeBtn.textContent === 'Dark') {
    themeBtn.textContent = 'Light';
    header.style.backgroundColor = '#000';
    body.style.backgroundColor = '#000';

    inputEl.style.color = '#fff';
    body.style.color = '#fff';

    themeBtn.style.color = '#fff';
  } else {
    themeBtn.textContent = 'Dark';
    header.style.backgroundColor = '#fff';
    body.style.backgroundColor = '#fff';
    body.style.color = '#000';
    themeBtn.style.backgroundColor = 'transparent';
    themeBtn.style.color = '#000';
    inputEl.style.color = '#000';
  }
});

loadMore.addEventListener('click', () => {
  queryParams.page += 1;
  queryFunction();
});

logoImg.addEventListener('click', backToTop);

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}
