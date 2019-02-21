import '@babel/polyfill';
import { watch } from 'melanke-watchjs';
import { flatten } from 'lodash';
import State from './AppState';
import load from './loader';

const controlleId = 'controlledForm';
const channelsId = 'channelsList';
const articlesId = 'articlesList';
const channelsHeader = document.createElement('h3');
channelsHeader.innerText = 'Channels';
const articlesHeader = document.createElement('h3');
articlesHeader.innerText = 'Articles';
const articleModalId = 'articleModal';
const articleModalBodyId = 'articleModalBody';

export default () => {
  const form = document.querySelector(`#${controlleId}`);
  const input = form.querySelector('[data-rss="input"]');
  const submit = form.querySelector('[type="submit"]');
  const feedback = form.querySelector('[data-rss="feedback"]');
  const channels = document.querySelector(`#${channelsId}`);
  const articles = document.querySelector(`#${articlesId}`);

  if (!input
    || !submit
    || !channels
    || !articles) {
    console.error('Отсутствуют элементы управления');
    return;
  }

  const state = new State();

  input.addEventListener('input', (e) => {
    state.setValue(e.target.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.request();
    load(state.value)
      .then((channel) => {
        const { data } = state;
        state.data = [...data, channel];
        state.success();
      })
      .catch((err) => {
        state.reject('Ошибка подключения');
        console.error(err);
      });
  });

  const renderLists = () => {
    channels.innerHTML = state.data.map(channel => `<div class="pl-2">
      <h5>${channel.title}</h5>
      <p class="font-weight-light pl-1">${channel.description}</p>
    </div><hr/>`).join('');
    channels.prepend(channelsHeader);
    const articlesItems = flatten(data.map(channel => channel.items));
    articles.innerHTML = articlesItems.map(item => `<div class="d-flex justify-content-between align-items-center py-1">
      <a href="${item.link}">${item.title}</a> \
      <button type="button" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#${articleModalId}">
        view
      </button>
    </div>`).join('');
    articles.prepend(articlesHeader);
  };

  watch(state, 'value', () => {
    input.value = state.value;
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
  watch(state, 'errorMessage', () => {
    feedback.textContent = state.errorMessage;
  });
  watch(state, 'data', () => {
    renderLists();
  });
  state.init();
};
