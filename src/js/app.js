import '@babel/polyfill';
// import { watch } from 'melanke-watchjs';
import { flatten } from 'lodash';
import FormControl from './FormControl';
import load from './loader';

const controlleId = 'controlledForm';
const channelsId = 'channelsList';
const articlesId = 'articlesList';
const channelsHeader = document.createElement('h3');
channelsHeader.innerText = 'Channels';
const articlesHeader = document.createElement('h3');
articlesHeader.innerText = 'Articles';

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

  let data = [];
  const formControl = new FormControl();

  input.addEventListener('input', (e) => {
    formControl.setValue(e.target.value);
    input.value = formControl.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formControl.request();
    load(formControl.value)
      .then((channel) => {
        data = [...data, channel];
        formControl.saveValueToBlacklist();
        formControl.accept();
      })
      .catch((err) => {
        formControl.reject('Ошибка подключения');
        console.error(err);
      });
  });

  const renderLists = () => {
    channels.innerHTML = data.map(channel => `<div class="pl-2">${channel.title}</div><hr/>`).join('');
    channels.prepend(channelsHeader);
    const articlesItems = flatten(data.map(channel => channel.items));
    articles.innerHTML = articlesItems.map(item => `<div>
      <a class="d-block" href="${item.link}">${item.title}</a>
    </div>`).join('');
    articles.prepend(articlesHeader);
  };
  // formControl.observe('onTransition', () => {
  //   input.value = formControl.value;
  // });

  formControl.observe('onEnterState', () => console.log(formControl.state));
  formControl.observe('onInit', () => {
    input.value = '';
    submit.disabled = true;
    input.disabled = false;
  });
  formControl.observe('onInvalid', () => {
    submit.disabled = true;
    input.disabled = false;
    input.classList.add('is-invalid');
    if (feedback) {
      feedback.textContent = formControl.errorMessage;
    }
  });
  formControl.observe('onValid', () => {
    submit.disabled = false;
    input.classList.remove('is-invalid');
  });
  formControl.observe('onPending', () => {
    submit.disabled = true;
    input.disabled = true;
  });
  formControl.observe('onAccept', () => {
    renderLists();
  });
  formControl.init();
};
