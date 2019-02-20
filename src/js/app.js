import '@babel/polyfill';
// import { watch } from 'melanke-watchjs';
import FormControl from './FormControl';
import load from './loader';

const controlleId = 'controlledForm';

export default () => {
  const form = document.querySelector(`#${controlleId}`);
  const input = form.querySelector('[data-rss="input"]');
  const submit = form.querySelector('[type="submit"]');
  const feedback = form.querySelector('[data-rss="feedback"]');

  if (!input || !submit) {
    console.error('Отсутствуют элементы управления');
    return;
  }

  // let data = [];
  const formControl = new FormControl();

  input.addEventListener('input', (e) => {
    formControl.setValue(e.target.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formControl.request();
    load(formControl.value)
      .then((res) => {
        formControl.accept();
        console.dir(res);
      })
      .catch((err) => {
        formControl.reject('Ошибка подключения');
        console.error(err);
      });
  });

  formControl.on('input', () => {
    input.value = formControl.value;
  });

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
  formControl.init();
};
