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

export default () => {
  const form = document.querySelector(`#${controlleId}`);
  const input = form.querySelector('[data-rss="input"]');
  const submit = form.querySelector('[type="submit"]');
  const feedback = form.querySelector('[data-rss="feedback"]');
  const channels = document.querySelector(`#${channelsId}`);
  const articles = document.querySelector(`#${articlesId}`);
  const modal = document.querySelector(`#${articleModalId}`);

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
        state.data = [channel, ...data];
        state.success();
      })
      .catch((err) => {
        state.reject('Ошибка подключения');
        console.error(err);
      });
  });

  articles.addEventListener('click', (e) => {
    if (e.target.type === 'button'
      && e.target.dataset.channel
      && e.target.dataset.index) {
      const item = state.data[e.target.dataset.channel].items[e.target.dataset.index];
      state.modal = {
        title: item.title || '',
        description: item.description || '',
      };
    }
  });

  const renderLists = () => {
    channels.innerHTML = state.data.map(channel => `<div class="pl-2">
      <h5>${channel.title}</h5>
      <p class="font-weight-light pl-1">${channel.description}</p>
    </div><hr/>`).join('');
    channels.prepend(channelsHeader);
    const articlesItemsRaw = state.data.map((channel, iChannel) => channel.items.map((item, i) => `
      <div class="d-flex justify-content-between align-items-center py-1">
        <a href="${item.link}">${item.title}</a>
        <button type="button" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#${articleModalId}" data-channel="${iChannel}" data-index="${i}">
          view
        </button>
      </div>`));
    articles.innerHTML = flatten(articlesItemsRaw).join('');
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

  watch(state, 'modal', () => {
    const modalBody = modal.querySelector('.modal-body');
    const modalTitle = modal.querySelector('.modal-title');
    modalBody.innerHTML = state.modal.description;
    modalTitle.innerText = state.modal.title;
  });
  state.init();
};
