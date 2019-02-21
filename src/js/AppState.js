import validator from 'validator';

export default class AppState {
  constructor(data) {
    this.addedFeedList = new Set();
    this.data = data || [];
  }

  init() {
    this.inputValue = '';
    this.isValidForm = true;
    this.isInputBlocked = false;
    this.isButtonBlocked = true;
    this.errorMessage = '';
    this.infoMessage = '';
    this.modal = {};
  }

  setInputValue(input) {
    const tirmedInput = validator.trim(input);
    const url = validator.stripLow(tirmedInput);
    this.inputValue = url;
    if (!validator.isURL(url)) {
      this.errorMessage = 'Неверно заполнено поле ввода';
      this.isValidForm = false;
      this.isButtonBlocked = true;
      return;
    }
    if (this.addedFeedList.has(url)) {
      this.errorMessage = 'Такой канал уже присутствует в списке';
      this.isValidForm = false;
      this.isButtonBlocked = true;
      return;
    }
    this.errorMessage = '';
    this.isValidForm = true;
    this.isButtonBlocked = false;
  }

  setOnPending() {
    this.isInputBlocked = true;
    this.isButtonBlocked = true;
    this.infoMessage = 'Загружаю канал...';
  }

  setOnRejected(message) {
    this.errorMessage = message || '';
    this.infoMessage = '';
    this.isValidForm = false;
    this.isButtonBlocked = true;
    this.isInputBlocked = false;
  }

  setOnSuccess() {
    if (this.inputValue) {
      this.addedFeedList.add(this.inputValue);
    }
    this.init();
  }
}
