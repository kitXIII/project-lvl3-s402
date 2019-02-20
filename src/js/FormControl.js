import StateMachine from 'javascript-state-machine';
import validator from 'validator';
import EventEmiter from 'events';

export default class FormControl extends EventEmiter {
  constructor(blacklist) {
    super();
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
      this.setInvalid();
    } else if (this.blacklist.has(url)) {
      this.errorMessage = 'Такой канал уже присутствует в списке';
      this.setInvalid();
    } else {
      this.errorMessage = '';
      this.setValid();
    }
    return this.emit('input');
  }

  setBlacklist(blacklist) {
    this.blacklist = new Set(blacklist || []);
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
