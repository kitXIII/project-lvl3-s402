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

const messages = {
  inputInvalid: 'Неверно заполнено поле ввода',
  pending: 'Загрузка канала...',
  rejected: 'Ошибка загрузки',
  duplicate: 'Такой канал уже присутствует в списке',
};

export default () => {
  const state = new State();

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

  input.addEventListener('input', (e) => {
    if (!validator.isURL(e.target.value)) {
      state.setInputValue(e.target.value);
      return state.setOnInvalid();
    }
    if (state.addedFeedList.has(e.target.value)) {
      state.setInputValue(e.target.value);
      return state.setOnError('duplicate');
    }
    state.setInputValue(e.target.value);
    return state.setOnValid();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.setOnPending();
    loadFeed(state.inputValue)
      .then((feed) => {
        state.addFeed(feed);
        state.done();
      })
      .catch((err) => {
        state.setOnError('rejected');
        console.error(err);
      });
  });

  articles.addEventListener('click', (e) => {
    if (e.target.dataset.channel && e.target.dataset.index) {
      const item = state.data[e.target.dataset.channel].items[e.target.dataset.index];
      state.modal = item;
    }
  });

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
        <button type="button" class="btn btn-sm btn-secondary ml-2" data-toggle="modal" data-target="#${articleModalId}" data-channel="${iChannel}" data-index="${i}">
          view
        </button>
      </div>`));
    articles.innerHTML = flatten(articlesItemsRaw).join('');
  };

  // const feedsOnLoading = new Set();
  // const updateFeeds = () => {
  //   const feedsToLoad = difference([...state.addedFeedList], [...feedsOnLoading]);
  // };

  const stateHandlers = {
    init: () => {
      input.classList.remove('is-invalid');
      input.disabled = false;
      submit.disabled = true;
      feedbackError.textContent = '';
      feedbackInfo.textContent = '';
    },
    onValid: () => {
      input.classList.remove('is-invalid');
      submit.disabled = false;
      feedbackError.textContent = '';
    },
    onInvalid: () => {
      input.classList.add('is-invalid');
      submit.disabled = true;
      feedbackError.textContent = messages.inputInvalid;
    },
    onError: () => {
      input.classList.add('is-invalid');
      input.disabled = false;
      submit.disabled = true;
      feedbackError.textContent = messages[state.errorType] || '';
      feedbackInfo.textContent = '';
    },
    onPending: () => {
      input.disabled = true;
      submit.disabled = true;
      feedbackInfo.textContent = messages.pending;
    },
  };

  watch(state, 'state', () => stateHandlers[state.state]());

  watch(state, 'inputValue', () => {
    input.value = state.inputValue;
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
