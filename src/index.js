import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { pictureClass } from './js/pictureClass.js';

const BASIC_URL = 'https://pixabay.com/api/';

axios.defaults.baseURL = BASIC_URL;
// axios.defaults.params = {
//   key: '29649041-262fdf0daa2a4569f2631b8dd',
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   per_page: 40,
//   page: 1,
// };

const allRefs = {
  search: document.querySelector('#search-form'),
  display: document.querySelector('.gallery'),
  load: document.querySelector('.load-more'),
  input: document.querySelector('input'),
};

let page = 0;

allRefs.search.addEventListener('submit', onSubmit);
allRefs.load.addEventListener('click', loadMore);

async function onSubmit(event) {
  event.preventDefault();
  page = 1;
  allRefs.display.innerHTML = '';
  searchPic(event.currentTarget.elements.searchQuery.value);
  allRefs.load.classList.remove('visually-hidden');
}

async function searchPic(searchResult) {
  try {
    const axiosResult = await axios.get(
      `https://pixabay.com/api/?key=29649041-262fdf0daa2a4569f2631b8dd&q=${searchResult}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
    );
    Notiflix.Notify.success(
      `Hooray! We found ${axiosResult.data.totalHits} images.`,
      {
        timeout: 3000,
      }
    );
    if (axiosResult.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 3000,
        }
      );
    }
    pictureMarkup(axiosResult);
  } catch (error) {
    Notiflix.Notify.failure(
      `Ooops... Something went wrong. We've got an error here: ${error}`,
      {
        timeout: 3000,
      }
    );
  }
}

function pictureMarkup({ data: { hits } }) {
  const picturesList = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </div>`;
      }
    )
    .join('');
  allRefs.display.insertAdjacentHTML('beforeend', picturesList);
  return;
}

async function loadMore() {
  try {
    const axiosResult = await axios.get(
      `https://pixabay.com/api/?key=29649041-262fdf0daa2a4569f2631b8dd&q=${
        allRefs.input.value
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${++page}`
    );
    pictureMarkup(axiosResult);
    if (axiosResult.data.hits.length < 40) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`,
        {
          timeout: 3000,
        }
      );
    }
  } catch (error) {
    allRefs.load.classList.add('visually-hidden');
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`,
      {
        timeout: 3000,
      }
    );
  }
}
