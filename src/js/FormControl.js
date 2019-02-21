import StateMachine from 'javascript-state-machine';
import validator from 'validator';

export default class FormControl {
  constructor(blacklist) {
    this.errorMessage = '';
    this.value = '';
    this.blacklist = new Set(blacklist || []);

    this._fsm(); // eslint-disable-line
  }

  setValue(input) {
    const tirmedInput = validator.trim(input);
    const url = validator.stripLow(tirmedInput);
    this.value = url;
    if (!validator.isURL(url)) {
      this.errorMessage = 'Неверно заполнено поле ввода';
      return this.setInvalid();
    }
    if (this.blacklist.has(url)) {
      this.errorMessage = 'Такой канал уже присутствует в списке';
      return this.setInvalid();
    }
    this.errorMessage = '';
    return this.setValid();
  }

  setBlacklist(blacklist) {
    this.blacklist = new Set(blacklist || []);
  }

  saveValueToBlacklist() {
    if (this.value) {
      this.blacklist.add(this.value);
    }
  }

  reject(message) {
    this.errorMessage = message || '';
    this.setInvalid();
  }
}

StateMachine.factory(FormControl, {
  init: 'init',
  transitions: [
    { name: 'setValid', from: ['init', 'valid', 'invalid'], to: 'valid' },
    { name: 'setInvalid', from: ['init', 'valid', 'invalid', 'pending'], to: 'invalid' },
    { name: 'request', from: 'valid', to: 'pending' },
    { name: 'accept', from: 'pending', to: 'init' },
    { name: 'init', from: '*', to: 'init' },
  ],
});
