import validator from 'validator';

export default class AppState {
  constructor(data) {
    this.blacklist = new Set();
    this.data = data || [];
    this.value = null;
    this.isValidForm = null;
    this.isInputBlocked = null;
    this.isButtonBlocked = null;
    this.errorMessage = null;
  }

  init() {
    this.value = '';
    this.isValidForm = true;
    this.isInputBlocked = false;
    this.isButtonBlocked = true;
    this.errorMessage = '';
  }

  setValue(input) {
    const tirmedInput = validator.trim(input);
    const url = validator.stripLow(tirmedInput);
    this.value = url;
    if (!validator.isURL(url)) {
      this.errorMessage = 'Неверно заполнено поле ввода';
      this.isValidForm = false;
      this.isButtonBlocked = true;
      return;
    }
    if (this.blacklist.has(url)) {
      this.errorMessage = 'Такой канал уже присутствует в списке';
      this.isValidForm = false;
      this.isButtonBlocked = true;
      return;
    }
    this.errorMessage = '';
    this.isValidForm = true;
    this.isButtonBlocked = false;
  }

  setBlacklist(blacklist) {
    this.blacklist = new Set(blacklist || []);
  }

  request() {
    this.isInputBlocked = true;
    this.isButtonBlocked = true;
    console.log(this);
  }

  reject(message) {
    this.errorMessage = message || '';
    this.isValidForm = false;
    this.isButtonBlocked = true;
    this.isInputBlocked = false;
    console.log(this);
  }

  success() {
    if (this.value) {
      this.blacklist.add(this.value);
    }
    console.log(this);
    this.init();
  }
}
