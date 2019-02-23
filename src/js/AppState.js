export default class AppState {
  constructor(data) {
    this.addedFeedList = new Set();
    this.data = data || [];
    this.inputValue = '';
    this.state = 'init';
    this.errorType = '';
    this.rssItemsModalContent = {};
  }

  addFeed(feed) {
    const { data } = this;
    this.data = [feed, ...data];
  }

  setInputValue(value) {
    this.inputValue = value;
  }

  setOnValid() {
    this.state = 'onValid';
  }

  setOnInvalid() {
    this.state = 'onInvalid';
  }

  setOnError(errorType) {
    this.state = 'onError';
    this.errorType = errorType;
  }

  setOnPending() {
    this.state = 'onPending';
  }

  setOnSuccess() {
    if (this.inputValue) {
      this.addedFeedList.add(this.inputValue);
    }
    this.inputValue = '';
    this.state = 'onSuccess';
  }
}
