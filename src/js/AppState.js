export default class AppState {
  constructor(data) {
    this.addedFeedList = new Set();
    this.data = data || [];
    this.inputValue = '';
    this.isValidForm = true;
    this.isInputBlocked = false;
    this.isButtonBlocked = true;
    this.errorMessage = '';
    this.infoMessage = '';
    this.modal = {};
  }

  addFeed(feed) {
    const { data } = this;
    this.data = [feed, ...data];
  }

  setInputValue(value) {
    this.inputValue = value;
  }

  setOnInvalid(message) {
    this.errorMessage = message || '';
    this.isValidForm = false;
    this.isButtonBlocked = true;
  }

  setOnValid() {
    this.errorMessage = '';
    this.isValidForm = true;
    this.isButtonBlocked = false;
  }

  setOnPending(message) {
    this.isInputBlocked = true;
    this.isButtonBlocked = true;
    this.infoMessage = message || '';
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
    this.inputValue = '';
    this.isValidForm = true;
    this.isInputBlocked = false;
    this.isButtonBlocked = true;
    this.errorMessage = '';
    this.infoMessage = '';
  }
}
