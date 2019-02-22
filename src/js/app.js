import '@babel/polyfill';
import { watch } from 'melanke-watchjs';
// import { flatten, difference } from 'lodash';
import { flatten } from 'lodash';
import validator from 'validator';
import State from './AppState';
import loadFeed from './loader';

const controlleId = 'controlledForm';
const feedsId = 'feedsList';
const feedsHeaderId = 'feedsListHeader';
const articlesId = 'articlesList';
const articlesHeaderId = 'articlesListHeader';
const articleModalId = 'articleModal';

export default () => {
  const form = document.querySelector(`#${controlleId}`);
  const input = form.querySelector('[data-rss="input"]');
  const submit = form.querySelector('[type="submit"]');
  const feedbackError = form.querySelector('[data-rss="feedback-error"]');
  const feedbackInfo = form.querySelector('[data-rss="feedback-info"]');
  const feeds = document.querySelector(`#${feedsId}`);
  const feedsHeader = document.querySelector(`#${feedsHeaderId}`);
  const articles = document.querySelector(`#${articlesId}`);
  const articlesHeader = document.querySelector(`#${articlesHeaderId}`);
  const modal = document.querySelector(`#${articleModalId}`);

  if (!input
    || !submit
    || !feeds
    || !articles) {
    console.error('Отсутствуют элементы управления');
    return;
  }

  const state = new State();

  input.addEventListener('input', (e) => {
    if (!validator.isURL(e.target.value)) {
      return state.setOnInvalid('Неверно заполнено поле ввода');
    }
    if (state.addedFeedList.has(e.target.value)) {
      return state.setOnInvalid('Такой канал уже присутствует в списке');
    }
    state.setInputValue(e.target.value);
    return state.setOnValid();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.setOnPending('Загружаю канал...');
    loadFeed(state.inputValue)
      .then((feed) => {
        state.addFeed(feed);
        state.setOnSuccess();
      })
      .catch((err) => {
        state.setOnRejected('Ошибка подключения');
        console.error(err);
      });
  });

  // eslint-disable-next-line no-unused-vars
  const modalButtonClickHandler = (button) => {
    const channel = button.dataset.channel || 0;
    const index = button.dataset.index || 0;
    const item = state.data[channel].items[index];
    state.modal = item;
  };

  const renderLists = () => {
    feedsHeader.classList.toggle('d-none', state.data.length === 0);
    articlesHeader.classList.toggle('d-none', state.data.length === 0);
    feeds.innerHTML = state.data.map(channel => `
      <div class="pl-2">
        <h5>${channel.title}</h5>
        <p class="font-weight-light pl-1">${channel.description}</p>
      </div><hr/>`).join('');
    const articlesItemsRaw = state.data.map((channel, iChannel) => channel.items.map((item, i) => `
      <div class="d-flex justify-content-between align-items-center py-1">
        <a href="${item.link}">${item.title}</a>
        <button type="button" class="btn btn-sm btn-secondary ml-2" data-toggle="modal" data-target="#${articleModalId}" data-channel="${iChannel}" data-index="${i}" onclick="modalButtonClickHandler(this)">
          view
        </button>
      </div>`));
    articles.innerHTML = flatten(articlesItemsRaw).join('');
  };

  // const feedsOnLoading = new Set();
  // const updateFeeds = () => {
  //   const feedsToLoad = difference([...state.addedFeedList], [...feedsOnLoading]);
  // };

  watch(state, 'inputValue', () => {
    input.value = state.inputValue;
  });

  watch(state, 'isValidForm', () => {
    if (state.isValidForm) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
  });

  watch(state, 'isButtonBlocked', () => {
    submit.disabled = state.isButtonBlocked;
  });

  watch(state, 'isInputBlocked', () => {
    input.disabled = state.isInputBlocked;
  });

  watch(state, 'infoMessage', () => {
    if (feedbackInfo) {
      feedbackInfo.textContent = state.infoMessage;
    }
  });

  watch(state, 'errorMessage', () => {
    if (feedbackError) {
      feedbackError.textContent = state.errorMessage;
    }
  });

  watch(state, 'data', renderLists);

  watch(state, 'modal', () => {
    if (modal) {
      const modalBody = modal.querySelector('.modal-body');
      const modalTitle = modal.querySelector('.modal-title');
      modalBody.innerHTML = state.modal.description;
      modalTitle.innerText = state.modal.title;
    }
  });
};
